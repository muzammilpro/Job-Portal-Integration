// app/profile/page.js
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Building2,
  Users,
  Sparkles,
  MapPin,
  Edit3,
  Mail,
  Calendar,
  ExternalLink,
  FileText,
  Download,
  Share2,
  Award,
  Code,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Phone,
  Linkedin,
  Github,
  Twitter,
  Instagram,
} from "lucide-react";
import Link from "next/link";

export default function PublicProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumePreviewUrl, setResumePreviewUrl] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    skills: true,
    education: true,
    experience: true,
  });

  const isOwner = session?.user?.email === profile?.email;

  useEffect(() => {
    if (status === "loading") return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const emailToFetch = emailParam || session?.user?.email;
        if (!emailToFetch) {
          router.push("/signin");
          return;
        }

        const res = await fetch(`/api/profile?email=${encodeURIComponent(emailToFetch)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        setProfile(data);

        if (data.resume?.originalName) {
          try {
            const previewRes = await fetch(`/api/profile/resume?email=${encodeURIComponent(emailToFetch)}`);
            if (previewRes.ok) {
              const blob = await previewRes.blob();
              setResumePreviewUrl(URL.createObjectURL(blob));
            }
          } catch (e) {
            console.error("Preview error", e);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [status, session, emailParam, router]);

  const getFileIcon = (mimeType, name) => {
    if (mimeType?.startsWith("image/")) return "🖼️";
    if (mimeType === "application/pdf") return "📄 PDF";
    return "📄 " + (name?.split(".").pop()?.toUpperCase() || "DOC");
  };

  const getSocialIcon = (platform) => {
    const lower = platform.toLowerCase();
    if (lower.includes("linkedin")) return <Linkedin className="w-5 h-5" />;
    if (lower.includes("github")) return <Github className="w-5 h-5" />;
    if (lower.includes("twitter") || lower.includes("x.com")) return <Twitter className="w-5 h-5" />;
    if (lower.includes("instagram")) return <Instagram className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };


  const copyProfileLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const calculateProfileCompleteness = () => {
    let score = 0;
    if (profile?.name) score += 15;
    if (profile?.image) score += 10;
    if (profile?.about) score += 15;
    if (profile?.skills?.length > 0) score += 15;
    if (profile?.education?.length > 0) score += 15;
    if (profile?.experience?.length > 0) score += 15;
    if (profile?.resume) score += 10;
    if (profile?.accounts?.length > 0) score += 5;
    return score;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-16">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mx-auto mb-8"></div>
          <p className="text-2xl font-semibold text-slate-700 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-50 flex items-center justify-center p-8">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-16 text-center max-w-lg">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Profile Not Found</h2>
          <p className="text-lg text-slate-600">This profile doesn't exist or is private.</p>
        </div>
      </div>
    );
  }

  const completeness = calculateProfileCompleteness();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-50 py-12 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Hero Header with Stats */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl border border-white/50 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-transparent to-sky-100/20" />
          
          <div className="relative p-10 lg:p-16">
            <div className="flex flex-col lg:flex-row items-start gap-10">
              {/* Avatar with Status */}
              <div className="relative">
                <img
                  src={profile.image || "/default-avatar.png"}
                  alt={profile.name}
                  className="w-40 h-40 rounded-3xl object-cover ring-8 ring-white/70 shadow-2xl border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-2xl shadow-lg text-sm font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-indigo-800 to-sky-900 bg-clip-text text-transparent mb-4">
                  {profile.name || "Anonymous User"}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-6 text-slate-600">
                  <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                      <Phone className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium">{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium">{profile.location}</span>
                    </div>
                  )}
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 text-center border border-indigo-100">
                    <Award className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">{profile.experience?.length || 0}</p>
                    <p className="text-sm text-slate-600">Experience</p>
                  </div>
                  <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-4 text-center border border-sky-100">
                    <Building2 className="w-6 h-6 text-sky-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">{profile.education?.length || 0}</p>
                    <p className="text-sm text-slate-600">Education</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 text-center border border-emerald-100">
                    <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-slate-900">{profile.skills?.length || 0}</p>
                    <p className="text-sm text-slate-600">Skills</p>
                  </div>
                </div>

                {/* Profile Completeness */}
                {isOwner && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">Profile Completeness</span>
                      <span className="text-lg font-bold text-amber-600">{completeness}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${completeness}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {isOwner ? (
                  <Link
                    href="/profile/edit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 whitespace-nowrap"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Profile
                  </Link>
                ) : (
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    Contact
                  </button>
                )}
           
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-lg border border-white/50 p-2 mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {["overview", "experience", "education", "skills"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === "overview" && (
          <>
            {/* Resume Section */}
            {profile.resume && (
              <section className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-10 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-xl">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Resume
                    </h2>
                  </div>
                  <button
                    onClick={() => toggleSection('resume')}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    {expandedSections.resume ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </button>
                </div>

                {expandedSections.resume !== false && (
                  <>
                    <div className="grid md:grid-cols-2 gap-8 items-center mb-6">
                      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-6 border border-slate-200">
                        <p className="text-lg font-semibold text-slate-800 mb-2">
                          {profile.resume.originalName}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Uploaded {new Date(profile.resume.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-4 justify-end">
                        <a
                          href={`/api/profile/resume?email=${encodeURIComponent(profile.email)}`}
                          download={profile.resume.originalName}
                          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
                        >
                          <Download className="w-5 h-5" />
                          Download
                        </a>
                      </div>
                    </div>

                    {resumePreviewUrl && (
                      <div className="mt-8 flex justify-center">
                        <div className="w-full max-w-2xl bg-gradient-to-br from-slate-100 to-indigo-50 rounded-3xl shadow-2xl overflow-hidden border border-white/60 p-8">
                          {profile.resume.mimeType?.startsWith("image/") ? (
                            <img src={resumePreviewUrl} alt="Resume" className="w-full h-auto object-contain rounded-2xl" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                              <FileText className="w-32 h-32 text-indigo-600 mb-6" />
                              <span className="text-2xl font-bold text-slate-700">
                                {getFileIcon(profile.resume.mimeType, profile.resume.originalName)}
                              </span>
                              <p className="text-slate-600 mt-4">Click Download to view full document</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>
            )}

            {/* About Me */}
            {profile.about && (
              <section className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-10 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      About Me
                    </h2>
                  </div>
                  <button
                    onClick={() => toggleSection('about')}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    {expandedSections.about ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </button>
                </div>
                {expandedSections.about && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                    <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap">{profile.about}</p>
                  </div>
                )}
              </section>
            )}

            {/* Social Links */}
            {profile.accounts?.length > 0 && (
              <section className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-xl flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Connect With Me
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.accounts.map((acc, i) => (
                    <a
                      key={i}
                      href={acc.url.startsWith("http") ? acc.url : `https://${acc.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl border border-purple-200 hover:shadow-xl hover:scale-105 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {getSocialIcon(acc.platform)}
                        <span className="font-bold text-purple-800 text-lg">{acc.platform}</span>
                      </div>
                      <ExternalLink className="w-6 h-6 text-purple-600 group-hover:translate-x-2 transition-transform" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {activeTab === "skills" && profile.skills?.length > 0 && (
          <section className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Skills & Expertise
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profile.skills.map((skill, i) => (
                <div
                  key={i}
                  className="group relative px-6 py-4 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 font-semibold rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all text-center border border-emerald-200"
                >
                  <Code className="w-5 h-5 mx-auto mb-2 text-emerald-600" />
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "education" && profile.education?.length > 0 && (
          <section className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-sky-500 rounded-3xl shadow-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Education
              </h2>
            </div>
            <div className="space-y-6">
              {profile.education.map((edu, i) => (
                <div key={i} className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-3xl p-8 border border-blue-200 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-lg font-semibold text-blue-700 mt-1 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {edu.institute}
                      </p>
                      <p className="text-slate-600 mt-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {edu.yearFrom} – {edu.yearTo || "Present"}
                      </p>
                    </div>
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "experience" && profile.experience?.length > 0 && (
          <section className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-xl flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Work Experience
              </h2>
            </div>
            <div className="space-y-6">
              {profile.experience.map((exp, i) => (
                <div key={i} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900">{exp.title}</h3>
                      <p className="text-lg font-semibold text-emerald-700 mt-1 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {exp.company}
                      </p>
                      <p className="text-slate-600 mt-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {exp.years}
                      </p>
                      {exp.description && (
                        <p className="text-slate-700 mt-4 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                      {i + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

   
    </div>
  );
}