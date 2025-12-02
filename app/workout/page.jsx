"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkoutPage() {
  const [workout, setWorkout] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("workout");
    if (saved) setWorkout(JSON.parse(saved));
  }, []);

  if (!workout)
    return (
      <div className="p-10 text-center text-gray-500">No workout loaded.</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {workout.program_name}
          </h1>
        </div>

        <Tabs defaultValue="week-1" className="w-full">
          <TabsList className="mb-6">
            {workout.weeks.map((week) => (
              <TabsTrigger
                key={week.week_number}
                value={`week-${week.week_number}`}
                className="px-6 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Week {week.week_number}
              </TabsTrigger>
            ))}
          </TabsList>

          {workout.weeks.map((week) => (
            <TabsContent
              key={week.week_number}
              value={`week-${week.week_number}`}
            >
              <div className="space-y-4">
                {week.days.map((day) => (
                  <Card key={day.day_number} className="overflow-hidden">
                    <div className="bg-indigo-100 px-6 py-4">
                      <h3 className="font-semibold text-gray-900">
                        Day {day.day_number} - {day.title}
                      </h3>
                    </div>

                    {day.exercises.length > 0 ? (
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Circuits
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Exercise
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Sets
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Reps
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Notes
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {day.exercises.map((exercise, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {String.fromCharCode(65 + idx)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {exercise.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {exercise.sets}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {exercise.reps}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 italic">
                                    {exercise.notes}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <Trash2 className="h-4 w-4 text-gray-400" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <GripVertical className="h-4 w-4 text-gray-400" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    ) : (
                      <CardContent className="py-8 text-center text-gray-500">
                        Rest Day
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
