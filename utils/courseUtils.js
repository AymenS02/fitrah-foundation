// utils/courseUtils.js
import Course from '../models/Course';
import CourseModule from '../models/CourseModule';

export class CourseModuleManager {
  // Create module and ensure it's linked to course
  static async createModule(courseId, moduleData) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const courseModule = await CourseModule.create({
      ...moduleData,
      courseId
    });

    return courseModule;
  }

  // Get all modules for a course with proper ordering
  static async getCourseModules(courseId) {
    return await CourseModule.find({ courseId })
      .sort({ order: 1 })
      .populate('courseId', 'title code');
  }

  // Delete module and ensure consistency
  static async deleteModule(moduleId) {
    const courseModule = await CourseModule.findById(moduleId);
    if (!courseModule) {
      throw new Error('Module not found');
    }

    await CourseModule.findByIdAndDelete(moduleId);
    return courseModule;
  }

  // Update module order
  static async updateModuleOrder(moduleId, newOrder) {
    const courseModule = await CourseModule.findById(moduleId);
    if (!courseModule) {
      throw new Error('Module not found');
    }

    courseModule.order = newOrder;
    await courseModule.save();
    return courseModule;
  }
}