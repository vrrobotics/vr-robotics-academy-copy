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
import { Plus, Video } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function AdminAddCoursesPage() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isSubVideoOpen, setIsSubVideoOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    syllabusCompletionTime: '',
    courseVideoUrl: '',
  });

  const [subVideoData, setSubVideoData] = useState({
    title: '',
    videoUrl: '',
  });

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { items } = await BaseCrudService.getAll<Courses>('courses');
      setCourses(items);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.courseVideoUrl) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await BaseCrudService.create('courses', {
        _id: crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        courseVideoUrl: formData.courseVideoUrl,
        price: 0,
        instructorName: 'Admin',
        thumbnail: '',
      });

      setFormData({
        title: '',
        description: '',
        syllabusCompletionTime: '',
        courseVideoUrl: '',
      });
      setIsFormOpen(false);
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    }
  };

  const handleAddSubVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourseId || !subVideoData.title || !subVideoData.videoUrl) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Create a lesson/sub-video entry
      await BaseCrudService.create('lessons', {
        _id: crypto.randomUUID(),
        moduleId: selectedCourseId,
        title: subVideoData.title,
        videoUrl: subVideoData.videoUrl,
        description: `Sub-video for course`,
        videoDuration: 0,
      });

      setSubVideoData({
        title: '',
        videoUrl: '',
      });
      setIsSubVideoOpen(false);
      setSelectedCourseId(null);
      fetchCourses();
    } catch (error) {
      console.error('Error adding sub-video:', error);
      alert('Failed to add sub-video');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Addition of Courses
          </h1>
          <p className="text-lg text-slate-300 font-paragraph">
            Manage and create new courses for your platform
          </p>
        </div>

        {/* Add Course Button */}
        <div className="mb-8">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-6 py-3 rounded-lg">
                <Plus size={20} />
                Add New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">Add New Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCourse} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-white mb-2 block">
                    Course Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter course title"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white mb-2 block">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter course description"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="syllabusTime" className="text-white mb-2 block">
                    Syllabus Completion Time
                  </Label>
                  <Input
                    id="syllabusTime"
                    value={formData.syllabusCompletionTime}
                    onChange={(e) => setFormData({ ...formData, syllabusCompletionTime: e.target.value })}
                    placeholder="e.g., 12 weeks"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="videoUrl" className="text-white mb-2 block">
                    Course Video Link *
                  </Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.courseVideoUrl}
                    onChange={(e) => setFormData({ ...formData, courseVideoUrl: e.target.value })}
                    placeholder="https://example.com/video"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
                  >
                    Add Course
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="bg-slate-700 hover:bg-slate-600 text-white flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Courses List */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-white mb-6">Designed Courses</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : courses.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700 p-8 text-center">
              <p className="text-slate-300 font-paragraph">No courses found. Create your first course!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course._id}
                  className="bg-slate-800 border-slate-700 overflow-hidden hover:border-orange-500 transition-colors"
                >
                  {/* Course Thumbnail */}
                  {course.thumbnail && (
                    <div className="w-full h-40 bg-slate-700 overflow-hidden">
                      <Image src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Course Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-bold text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-slate-300 font-paragraph text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {course.instructorName && (
                      <p className="text-slate-400 text-sm mb-4">
                        <span className="font-semibold">Instructor:</span> {course.instructorName}
                      </p>
                    )}

                    {/* Sub Videos Button */}
                    <Dialog open={isSubVideoOpen && selectedCourseId === course._id} onOpenChange={(open) => {
                      setIsSubVideoOpen(open);
                      if (!open) setSelectedCourseId(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedCourseId(course._id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                        >
                          <Video size={18} />
                          Sub Videos
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-heading">
                            Add Sub-Video to {course.title}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddSubVideo} className="space-y-6">
                          <div>
                            <Label htmlFor="subVideoTitle" className="text-white mb-2 block">
                              Sub-Video Title *
                            </Label>
                            <Input
                              id="subVideoTitle"
                              value={subVideoData.title}
                              onChange={(e) => setSubVideoData({ ...subVideoData, title: e.target.value })}
                              placeholder="Enter sub-video title"
                              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            />
                          </div>

                          <div>
                            <Label htmlFor="subVideoUrl" className="text-white mb-2 block">
                              Video URL *
                            </Label>
                            <Input
                              id="subVideoUrl"
                              type="url"
                              value={subVideoData.videoUrl}
                              onChange={(e) => setSubVideoData({ ...subVideoData, videoUrl: e.target.value })}
                              placeholder="https://example.com/video"
                              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            />
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                            >
                              Add Sub-Video
                            </Button>
                            <Button
                              type="button"
                              onClick={() => {
                                setIsSubVideoOpen(false);
                                setSelectedCourseId(null);
                              }}
                              className="bg-slate-700 hover:bg-slate-600 text-white flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
