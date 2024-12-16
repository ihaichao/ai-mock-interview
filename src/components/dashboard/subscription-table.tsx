import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Subscription {
  upgrade: string
  date: string
  price: number
  state: string
}

const subscriptions: Subscription[] = [
  { upgrade: "Essential", date: "11 Nov, 2024", price: 59.00, state: "In effect (Expires on 14 Dec)" },
  { upgrade: "Essential", date: "11 Nov, 2024", price: 59.00, state: "Expired" },
  { upgrade: "Pro", date: "11 Nov, 2024", price: 49.00, state: "Expired" },
  { upgrade: "Essential", date: "11 Nov, 2024", price: 59.00, state: "Expired" },
]

export function SubscriptionTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F8F9FA]">
          <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">Upgrade</TableHead>
          <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">Date</TableHead>
          <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">Price</TableHead>
          <TableHead className="w-[25%] py-3 text-sm font-medium text-[#6C757D]">State</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((subscription, index) => (
          <TableRow key={index} className="border-b">
            <TableCell className="py-4 font-medium">{subscription.upgrade}</TableCell>
            <TableCell className="py-4">{subscription.date}</TableCell>
            <TableCell className="py-4">${subscription.price.toFixed(2)}</TableCell>
            <TableCell className="py-4">
              <span className={`text-sm ${subscription.state.includes("In effect") ? "text-[#4AE68A]" : "text-[#6C757D]"}`}>
                {subscription.state}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

