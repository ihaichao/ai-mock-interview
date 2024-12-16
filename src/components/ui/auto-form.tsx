import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./form"
import { Input } from "./input"
import { Textarea } from "./textarea"

interface AutoFormProps<T extends z.ZodObject<any>> {
  schema: T
  form: any
  path?: string
}

export function AutoForm<T extends z.ZodObject<any>>({ 
  schema, 
  form, 
  path = "" 
}: AutoFormProps<T>) {
  // 获取 schema 的所有字段
  const fields = Object.entries(schema.shape)

  return (
    <>
      {fields.map(([key, field]) => {
        const fieldPath = path ? `${path}.${key}` : key
        
        // 如果是对象类型，递归渲染
        if (field instanceof z.ZodObject) {
          return (
            <div key={key} className="space-y-4">
              <h3 className="font-medium">{formatLabel(key)}</h3>
              <AutoForm
                schema={field}
                form={form}
                path={fieldPath}
              />
            </div>
          )
        }

        // 如果是数组类型
        if (field instanceof z.ZodArray) {
          const arrayValues = form.watch(fieldPath) || []
          
          return (
            <div key={key} className="space-y-4">
              <h3 className="font-medium">{formatLabel(key)}</h3>
              {arrayValues.map((_: any, index: number) => (
                <div key={index} className="space-y-4">
                  <AutoForm
                    schema={field.element as z.ZodObject<any>}
                    form={form}
                    path={`${fieldPath}.${index}`}
                  />
                </div>
              ))}
            </div>
          )
        }

        // 渲染基础字段
        return (
          <FormField
            key={fieldPath}
            control={form.control}
            name={fieldPath}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formatLabel(key)}</FormLabel>
                <FormControl>
                  {shouldUseTextarea(key) ? (
                    <Textarea {...field} />
                  ) : (
                    <Input {...field} type={getInputType(key)} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      })}
    </>
  )
}

// 辅助函数
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // 在大写字母前添加空格
    .replace(/^./, str => str.toUpperCase()) // 首字母大写
    .trim()
}

function getInputType(key: string): string {
  switch (key) {
    case 'email':
      return 'email'
    case 'phone':
      return 'tel'
    case 'password':
      return 'password'
    case 'startDate':
    case 'endDate':
      return 'date'
    case 'url':
    case 'social':
      return 'url'
    default:
      return 'text'
  }
}

function shouldUseTextarea(key: string): boolean {
  return [
    'description',
    'introduction',
    'workDescription',
    'summary',
    'notes'
  ].includes(key)
}