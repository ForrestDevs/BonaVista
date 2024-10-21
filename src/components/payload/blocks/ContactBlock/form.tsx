'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    interestedIn: '',
    message: '',
    signUp: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="emailAddress">Email Address *</Label>
          <Input
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <Label htmlFor="interestedIn">I am interested in...</Label>
        <Select
          name="interestedIn"
          value={formData.interestedIn}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, interestedIn: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pools">Pools</SelectItem>
            <SelectItem value="spas">Spas</SelectItem>
            <SelectItem value="landscaping">Landscaping</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="message">How can we help? *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="signUp"
          name="signUp"
          checked={formData.signUp}
          onChange={handleInputChange}
          className="mr-2"
        />
        <Label htmlFor="signUp">Sign up for our exclusive offers</Label>
      </div>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  )
}
