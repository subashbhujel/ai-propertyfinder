"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MortgageCalculatorProps {
  propertyPrice: number
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100
  const loanAmount = propertyPrice - downPaymentAmount

  useEffect(() => {
    // Calculate monthly mortgage payment
    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (monthlyInterestRate === 0) {
      setMonthlyPayment(loanAmount / numberOfPayments)
    } else {
      const payment =
        (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      setMonthlyPayment(payment)
    }
  }, [loanAmount, interestRate, loanTerm])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Down Payment ({downPaymentPercent}%)</Label>
          <span className="text-sm font-medium">${downPaymentAmount.toLocaleString()}</span>
        </div>
        <Slider
          value={[downPaymentPercent]}
          min={0}
          max={50}
          step={1}
          onValueChange={(values) => setDownPaymentPercent(values[0])}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interest-rate">Interest Rate (%)</Label>
          <Input
            id="interest-rate"
            type="number"
            step="0.1"
            min="0"
            max="20"
            value={interestRate}
            onChange={(e) => setInterestRate(Number.parseFloat(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loan-term">Loan Term (Years)</Label>
          <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(Number.parseInt(value))}>
            <SelectTrigger id="loan-term">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 years</SelectItem>
              <SelectItem value="20">20 years</SelectItem>
              <SelectItem value="30">30 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between text-sm">
          <span>Loan Amount:</span>
          <span>${loanAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mt-2">
          <span>Monthly Payment:</span>
          <span>${monthlyPayment.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

