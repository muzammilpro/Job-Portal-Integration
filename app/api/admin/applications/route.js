import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";

/**
 * =========================
 * GET → Fetch all applications
 * =========================
 */
export async function GET() {
  try {
    await connectDB();

    // Fetch jobs with applications
    const jobs = await Job.find({ "applications.0": { $exists: true } })
      .populate("applications.userId", "name email image resume")
      .sort({ createdAt: -1 });

    // Flatten applications for admin UI
    const applications = [];

    jobs.forEach((job) => {
      job.applications.forEach((app) => {
        if (!app.userId) return;

        applications.push({
          _id: app._id,
          status: app.status,
          appliedAt: app.appliedAt,

          jobId: job._id,
          jobTitle: job.title,

          applicant: {
            id: app.userId._id,
            name: app.userId.name,
            email: app.userId.email,
            image: app.userId.image || null,
            hasResume: !!app.userId.resume?.data,
          },
        });
      });
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Admin applications GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

/**
 * =========================
 * PATCH → Update application status
 * =========================
 */
export async function PATCH(req) {
  try {
    await connectDB();

    const { applicationId, status } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // Update embedded application status
    const job = await Job.findOneAndUpdate(
      { "applications._id": applicationId },
      {
        $set: {
          "applications.$.status": status,
        },
      },
      { new: true }
    );

    if (!job) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin applications PATCH error:", error);
    return NextResponse.json(
      { message: "Failed to update status" },
      { status: 500 }
    );
  }
}
