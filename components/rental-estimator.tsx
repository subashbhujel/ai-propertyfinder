"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"

interface RentalEstimatorProps {
  propertyPrice: number
  propertyTax: number
  hoaFee: number
  bedrooms: number
  location: string
}

export function RentalEstimator({ propertyPrice, propertyTax, hoaFee, bedrooms, location }: RentalEstimatorProps) {
  // Estimated rental income based on property details
  const [rentalIncome, setRentalIncome] = useState(Math.round((propertyPrice * 0.008) / 100) * 100)
  const [vacancyRate, setVacancyRate] = useState(5)
  const [managementFeePercent, setManagementFeePercent] = useState(10)
  const [maintenancePercent, setMaintenancePercent] = useState(5)
  const [insuranceCost, setInsuranceCost] = useState(Math.round((propertyPrice * 0.005) / 12 / 10) * 10)

  // Mortgage calculation (simplified for this component)
  const downPaymentPercent = 20
  const interestRate = 6.5
  const loanTerm = 30

  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100
  const loanAmount = propertyPrice - downPaymentAmount

  // Calculate monthly mortgage payment
  const monthlyInterestRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm * 12
  const mortgagePayment =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

  // Calculate expenses
  const effectiveRentalIncome = rentalIncome * (1 - vacancyRate / 100)
  const managementFee = rentalIncome * (managementFeePercent / 100)
  const maintenanceCost = rentalIncome * (maintenancePercent / 100)
  const monthlyPropertyTax = propertyTax / 12

  const totalExpenses = mortgagePayment + managementFee + maintenanceCost + monthlyPropertyTax + hoaFee + insuranceCost

  const cashFlow = effectiveRentalIncome - totalExpenses
  const cashFlowPercent = (cashFlow / effectiveRentalIncome) * 100

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="rental-income">Monthly Rental Income ($)</Label>
        </div>
        <Input
          id="rental-income"
          type="number"
          value={rentalIncome}
          onChange={(e) => setRentalIncome(Number.parseInt(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Vacancy Rate ({vacancyRate}%)</Label>
        </div>
        <Slider value={[vacancyRate]} min={0} max={20} step={1} onValueChange={(values) => setVacancyRate(values[0])} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Property Management ({managementFeePercent}%)</Label>
        </div>
        <Slider
          value={[managementFeePercent]}
          min={0}
          max={15}
          step={1}
          onValueChange={(values) => setManagementFeePercent(values[0])}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maintenance">Maintenance (%)</Label>
          <Input
            id="maintenance"
            type="number"
            min="1"
            max="15"
            value={maintenancePercent}
            onChange={(e) => setMaintenancePercent(Number.parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance">Insurance ($/mo)</Label>
          <Input
            id="insurance"
            type="number"
            value={insuranceCost}
            onChange={(e) => setInsuranceCost(Number.parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <div className="flex justify-between text-sm">
          <span>Effective Rental Income:</span>
          <span>${effectiveRentalIncome.toFixed(2)}/mo</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total Expenses:</span>
          <span>${totalExpenses.toFixed(2)}/mo</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Monthly Cash Flow:</span>
          <span className={cashFlow >= 0 ? "text-green-600" : "text-red-600"}>${cashFlow.toFixed(2)}/mo</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Loss</span>
            <span>Break-even</span>
            <span>Profit</span>
          </div>
          <Progress value={Math.min(Math.max(cashFlowPercent + 50, 0), 100)} className="h-2" />
        </div>
      </div>
    </div>
  )
}

