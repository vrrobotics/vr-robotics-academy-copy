import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { Courses } from '@/entities';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Star, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Image } from '@/components/ui/image';

interface FeaturedCourse {
  _id: string;
  courseId: string;
  courseName: string;
  description: string;
  courseImage: string;
  videoUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminFeaturedCoursesPage() {
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState<Courses[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<FeaturedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    courseImage: '',
    videoUrl: '',
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all courses
      const { items: courses } = await BaseCrudService.getAll<Courses>('courses');
      setAllCourses(courses);

      // Fetch featured courses
      const { items: featured } = await BaseCrudService.getAll<FeaturedCourse>('featuredcourses');
      setFeaturedCourses(featured);

      // Initialize selected courses
      const selectedIds = new Set(featured.map(f => f.courseId));
      setSelectedCourses(selectedIds);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseToggle = (courseId: string) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const handleSaveFeaturedCourses = async () => {
    try {
      // Remove courses that are no longer featured
      for (const featured of featuredCourses) {
        if (!selectedCourses.has(featured.courseId)) {
          await BaseCrudService.delete('featuredcourses', featured._id);
        }
      }

      // Add new featured courses
      const existingCourseIds = new Set(featuredCourses.map(f => f.courseId));
      let displayOrder = featuredCourses.length;

      for (const courseId of selectedCourses) {
        if (!existingCourseIds.has(courseId)) {
          const course = allCourses.find(c => c._id === courseId);
          if (course) {
            await BaseCrudService.create('featuredcourses', {
              _id: crypto.randomUUID(),
              courseId: courseId,
              courseName: course.title || '',
              description: course.description || '',
              courseImage: course.thumbnail || '',
              videoUrl: course.courseVideoUrl || '',
              displayOrder: displayOrder++,
              isActive: true
            });
          }
        }
      }

      setIsDialogOpen(false);
      fetchData();
      alert('Featured courses updated successfully!');
    } catch (error) {
      console.error('Error saving featured courses:', error);
      alert('Failed to update featured courses');
    }
  };

  const handleRemoveFeatured = async (courseId: string) => {
    try {
      const featured = featuredCourses.find(f => f.courseId === courseId);
      if (featured) {
        await BaseCrudService.delete('featuredcourses', featured._id);
        fetchData();
      }
    } catch (error) {
      console.error('Error removing featured course:', error);
    }
  };

  const handleAddNewFeaturedCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseName || !formData.description || !formData.videoUrl) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Create a new featured course entry
      await BaseCrudService.create('featuredcourses', {
        _id: crypto.randomUUID(),
        courseId: crypto.randomUUID(), // Generate unique ID for custom course
        courseName: formData.courseName,
        description: formData.description,
        courseImage: formData.courseImage,
        videoUrl: formData.videoUrl,
        displayOrder: featuredCourses.length,
        isActive: true
      });

      // Reset form
      setFormData({
        courseName: '',
        description: '',
        courseImage: '',
        videoUrl: '',
      });
      setIsAddFormOpen(false);
      fetchData();
      alert('Featured course added successfully!');
    } catch (error) {
      console.error('Error adding featured course:', error);
      alert('Failed to add featured course');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
                Featured Courses Management
              </h1>
            </div>
            <p className="text-lg text-slate-300 font-paragraph ml-16">
              Select which courses appear on the home page featured section or add new featured courses
            </p>
          </div>
        </div>

        {/* Add New Featured Course Form */}
        <div className="mb-12">
          <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-6 py-3 rounded-lg mb-8">
                <Plus size={20} />
                Add New Featured Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">Add New Featured Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddNewFeaturedCourse} className="space-y-6">
                <div>
                  <Label htmlFor="courseName" className="text-white mb-2 block">
                    Course Title *
                  </Label>
                  <Input
                    id="courseName"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    placeholder="Enter course title"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="courseDescription" className="text-white mb-2 block">
                    Description *
                  </Label>
                  <Textarea
                    id="courseDescription"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter course description"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="courseImage" className="text-white mb-2 block">
                    Course Image URL
                  </Label>
                  <Input
                    id="courseImage"
                    type="url"
                    value={formData.courseImage}
                    onChange={(e) => setFormData({ ...formData, courseImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="courseVideoUrl" className="text-white mb-2 block">
                    Course Video Link *
                  </Label>
                  <Input
                    id="courseVideoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://example.com/video"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
                  >
                    Add Featured Course
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsAddFormOpen(false)}
                    className="bg-slate-700 hover:bg-slate-600 text-white flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Currently Featured Courses */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-white mb-6">Currently Featured</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : featuredCourses.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700 p-8 text-center">
              <p className="text-slate-300 font-paragraph mb-4">No featured courses yet</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Star className="w-4 h-4 mr-2" />
                    Add Featured Courses
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-heading">Select Featured Courses</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {allCourses.map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        <Checkbox
                          id={course._id}
                          checked={selectedCourses.has(course._id)}
                          onCheckedChange={() => handleCourseToggle(course._id)}
                          className="w-5 h-5"
                        />
                        <div className="flex-grow">
                          <label
                            htmlFor={course._id}
                            className="text-white font-heading cursor-pointer block"
                          >
                            {course.title}
                          </label>
                          <p className="text-slate-300 text-sm font-paragraph line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-6 border-t border-slate-700">
                    <Button
                      onClick={handleSaveFeaturedCourses}
                      className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
                    >
                      Save Featured Courses
                    </Button>
                    <Button
                      onClick={() => setIsDialogOpen(false)}
                      className="bg-slate-700 hover:bg-slate-600 text-white flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((featured) => (
                <Card
                  key={featured._id}
                  className="bg-slate-800 border-slate-700 overflow-hidden hover:border-orange-500 transition-colors"
                >
                  {/* Course Image */}
                  {featured.courseImage && (
                    <div className="w-full h-40 bg-slate-700 overflow-hidden relative">
                      <Image
                        src={featured.courseImage}
                        alt={featured.courseName}
                        className="w-full h-full object-cover"
                        width={400}
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white p-2 rounded-lg">
                        <Star className="w-5 h-5 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Course Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-bold text-white mb-2 line-clamp-2">
                      {featured.courseName}
                    </h3>
                    <p className="text-slate-300 font-paragraph text-sm mb-4 line-clamp-3">
                      {featured.description}
                    </p>

                    <Button
                      onClick={() => handleRemoveFeatured(featured.courseId)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove from Featured
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Edit Featured Courses Button */}
        {allCourses.length > 0 && (
          <div className="flex justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                  <Star className="w-4 h-4 mr-2" />
                  Edit Featured Courses from Library
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading">Select Featured Courses</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {allCourses.map((course) => (
                    <div
                      key={course._id}
                      className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <Checkbox
                        id={course._id}
                        checked={selectedCourses.has(course._id)}
                        onCheckedChange={() => handleCourseToggle(course._id)}
                        className="w-5 h-5"
                      />
                      <div className="flex-grow">
                        <label
                          htmlFor={course._id}
                          className="text-white font-heading cursor-pointer block"
                        >
                          {course.title}
                        </label>
                        <p className="text-slate-300 text-sm font-paragraph line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 pt-6 border-t border-slate-700">
                  <Button
                    onClick={handleSaveFeaturedCourses}
                    className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
                  >
                    Save Featured Courses
                  </Button>
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-slate-700 hover:bg-slate-600 text-white flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
