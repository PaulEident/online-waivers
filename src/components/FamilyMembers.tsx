"use client";

import { useState } from "react";

export interface FamilyMember {
  firstName: string;
  lastName: string;
  age: string;
}

interface FamilyMembersProps {
  members: FamilyMember[];
  onChange: (members: FamilyMember[]) => void;
}

export default function FamilyMembers({ members, onChange }: FamilyMembersProps) {
  const addMember = () => {
    onChange([...members, { firstName: "", lastName: "", age: "" }]);
  };

  const removeMember = (index: number) => {
    onChange(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = members.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          Family Members (Children Under 18)
        </label>
        <button
          type="button"
          onClick={addMember}
          className="inline-flex items-center px-3 py-1.5 bg-green-700 text-white text-sm font-medium rounded-md hover:bg-green-800 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Child
        </button>
      </div>

      {members.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No family members added. Click &quot;Add Child&quot; to include children under 18 on this waiver.
        </p>
      )}

      {members.map((member, index) => (
        <div
          key={index}
          className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Child #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeMember(index)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={member.firstName}
                onChange={(e) => updateMember(index, "firstName", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={member.lastName}
                onChange={(e) => updateMember(index, "lastName", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Last name"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={member.age}
                onChange={(e) => updateMember(index, "age", e.target.value)}
                required
                min="0"
                max="17"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Age"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
