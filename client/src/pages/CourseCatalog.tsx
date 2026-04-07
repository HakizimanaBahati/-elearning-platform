import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { BookOpen, Star, Users, Clock, Search } from "lucide-react";

export default function CourseCatalog() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const { data: courses = [], isLoading } = trpc.courses.list.useQuery();

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));
  const levels = ["beginner", "intermediate", "advanced"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-indigo-100 text-lg">Discover thousands of courses to advance your skills</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-20">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Category</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    className="w-full justify-start"
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className="w-full justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Level</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedLevel === null ? "default" : "outline"}
                    onClick={() => setSelectedLevel(null)}
                    className="w-full justify-start"
                  >
                    All Levels
                  </Button>
                  {levels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      onClick={() => setSelectedLevel(level)}
                      className="w-full justify-start capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-600">No courses found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    {course.thumbnail && (
                      <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full capitalize">
                          {course.level}
                        </span>
                        {course.price && parseFloat(course.price.toString()) > 0 && (
                          <span className="text-lg font-bold text-indigo-600">
                            ${parseFloat(course.price.toString()).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Instructor</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.id}`);
                        }}
                      >
                        View Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
