import React from "react";
import {
    Users, Target, Award, Rocket,
    ArrowRight, Heart, Brain, Zap, Briefcase, GraduationCap, ShieldCheck, Activity, Languages, Stethoscope, Search, Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const team = [
    {
        name: "Dr. Amine Mansouri",
        role: "Chief Medical Officer",
        initials: "AM",
        bio: "Pharmacologist with 15 years of experience in clinical drug safety and patient advocacy.",
        tag: "Medical Lead"
    },
    {
        name: "Sarah Benali",
        role: "Head of AI Engineering",
        initials: "SB",
        bio: "Expert in NLP and medical data processing, dedicated to making clinical data accessible in Darija.",
        tag: "Tech Lead"
    },
    {
        name: "Reda Belkacem",
        role: "Pharmacist Relations",
        initials: "RB",
        bio: "Ensuring MedSafe integrates seamlessly into the daily workflow of Algerian community pharmacies.",
        tag: "Operations"
    }
];

const stats = [
    { label: "Active Users", value: "250+", icon: Briefcase },
    { label: "Verified Records", value: "236k+", icon: ShieldCheck },
    { label: "Partner Pharmacies", value: "100+", icon: Rocket },
    { label: "Safety Rate", value: "99%", icon: Zap }
];

export default function AboutUs() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-24 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,0.1),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <Badge variant="outline" className="text-primary border-primary/30 mb-6 px-4 py-1 bg-primary/10">
                        Our Story
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                        Empowering medication <br />
                        <span className="text-primary italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Safety.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        MedSafe is more than just a platform—it's a bridge between medical data and patient safety,
                        connecting clinical records with Algerian families in their native language.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-primary relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1 tracking-tighter">{stat.value}</div>
                                <div className="text-primary-foreground/70 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                <Target className="text-primary" />
                                Our Mission
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                MedSafe was founded with a singular focus: to modernize how drug interactions
                                are handled in Algeria. We provide a centralized, smart platform
                                for patients to discover safety risks and for pharmacists to validate treatments.
                            </p>
                            <Separator className="bg-slate-200" />
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="h-2 w-12 bg-primary rounded-full" />
                                    <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">Accessibility</p>
                                    <p className="text-sm text-slate-500">Connecting talent from all 58 provinces to medical safety.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-12 bg-slate-400 rounded-full" />
                                    <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">Innovation</p>
                                    <p className="text-sm text-slate-500">Using smart algorithms to ensure the perfect safety check.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 p-12 flex flex-col justify-center text-white min-h-[400px] shadow-2xl">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Stethoscope size={120} className="text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold mb-6 tracking-tight">Our Vision</h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed italic">
                                "To become the definitive medical safety launchpad for Algeria,
                                ensuring every patient has a clear path to health excellence
                                through native-language digital tools."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                                    <Heart className="text-primary h-5 w-5 fill-primary" />
                                </div>
                                <span className="font-bold text-sm tracking-widest uppercase">Driven by Growth</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section — CLEANER VERSION */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">The Makers of MedSafe</h2>
                            <p className="text-slate-500 text-lg max-w-xl font-medium">
                                Our diverse team combines medical expertise with world-class engineering
                                to build a platform that truly serves the health of all Algerians.
                            </p>
                        </div>
                        <Link to="/register">
                            <Button variant="outline" className="rounded-full font-bold px-8 group border-slate-200 shadow-none">
                                Join Our Mission
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, i) => (
                            <Card key={i} className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-3xl bg-white overflow-hidden">
                                <CardHeader className="p-10 pb-4">
                                    <Avatar className="h-20 w-20 mb-6">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl tracking-tighter">
                                            {member.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-3 font-bold text-[10px] mb-2 uppercase tracking-widest">
                                            {member.tag}
                                        </Badge>
                                        <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">{member.name}</CardTitle>
                                        <CardDescription className="text-primary font-bold text-xs uppercase tracking-widest">
                                            {member.role}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10 pt-2">
                                    <Separator className="mb-8 opacity-50" />
                                    <p className="text-slate-500 leading-relaxed text-sm italic font-medium">
                                        "{member.bio}"
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-xl border border-white/5">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                            Ready to check your medications?
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                            Join the fastest-growing health safety community in Algeria and protect your family today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/interactions">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-13 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                                    Check Interactions
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:bg-white/10 px-8 h-13 rounded-xl font-bold transition-all active:scale-95">
                                    Join MedSafe
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
