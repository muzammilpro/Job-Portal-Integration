"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, LogOut, ArrowRight, Clock } from "lucide-react";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `/api/users/applied-jobs?email=${encodeURIComponent(
            session.user.email
          )}`
        );
        if (!res.ok) {
          setJobs([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setJobs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [status, session?.user?.email]);

  if (status === "loading")
    return
  (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <div className="flex flex-col items-center gap-6">
      <div className="w-20 h-20 border-4 border-t-indigo-600 border-r-purple-600 border-b-pink-600 border-l-transparent rounded-full animate-spin"></div>
      <p className="text-indigo-700 text-xl font-medium">Loading Applications ...</p>
    </div>
  </div>);

  if (status === "unauthenticated" || session?.user?.role !== "user") {
    router.push("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              My Applications
            </h1>
            <p className="text-slate-600 mt-1">
              Jobs you have applied for with this account.
            </p>
          </div>

        </div>

        {/* Welcome card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sm:p-8 mb-8">
          <p className="text-lg font-semibold text-slate-800 mb-1">
            Welcome, {session.user.name || session.user.email}
          </p>
          <p className="text-slate-600 text-sm">
            Track all the jobs you have applied to and review details anytime.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-600">Loading your applications...</p>
        ) : jobs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-800 mb-2">
              No applications yet
            </p>
            <p className="text-slate-600 mb-6">
              Browse jobs and apply to see them listed here.
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-semibold shadow-md"
            >
              Browse Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <AppliedJobCard key={job._id} job={job} userEmail={session.user.email} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function AppliedJobCard({ job, userEmail }) {

  const myApp =
    job.applications?.find((a) => a.userEmail === userEmail) || null;

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {job.title}
        </h3>
        <p className="text-slate-600 font-medium">{job.company}</p>
        <p className="text-slate-500 text-sm mb-3">{job.location}</p>
        {job.salary && (
          <p className="text-emerald-600 font-semibold mb-2">
            {job.salary}
          </p>
        )}
        {job.description && (
          <p className="text-sm text-slate-600 line-clamp-3">
            {job.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
        <div className="flex flex-col">
          {myApp && (
            <>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Clock className="w-4 h-4" />
                Applied on{" "}
                {new Date(myApp.appliedAt).toLocaleDateString()}
              </span>
              <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                Status: {myApp.status || "pending"}
              </span>
            </>
          )}
        </div>
        <Link
          href={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700"
        >
          View job
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
