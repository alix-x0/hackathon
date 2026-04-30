import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { ACCESS_TOKEN } from "@/constants";
import {
    Mail, Phone, Shield, Calendar, Loader2, Settings, CheckCircle2,
    Pill, Search, Plus, Trash2, Upload, FileImage, X, MapPin,
    Heart, Activity, AlertTriangle, Clock, User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [savedMeds, setSavedMeds] = useState([]);
    const [medSearchTerm, setMedSearchTerm] = useState("");
    const [medSuggestions, setMedSuggestions] = useState([]);
    const [loadingMeds, setLoadingMeds] = useState(false);
    const [addingMed, setAddingMed] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // Editable medical info (stored in localStorage for now)
    const [medicalInfo, setMedicalInfo] = useState(() => {
        const saved = localStorage.getItem('medsafe_medical_info');
        return saved ? JSON.parse(saved) : { blood_type: '', allergies: '', conditions: '', emergency_contact: '' };
    });
    const [editingMedInfo, setEditingMedInfo] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (token) {
                    const res = await api.get('/auth/profile/');
                    setProfile(res.data);
                } else { navigate('/login'); }
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchProfile();
        fetchSavedMeds();
    }, [navigate]);

    const fetchSavedMeds = async () => {
        setLoadingMeds(true);
        try {
            const res = await api.get('/medication-profile/');
            const data = res.data;
            setSavedMeds(Array.isArray(data) ? data : (data.results || []));
        } catch (e) { console.error(e); }
        finally { setLoadingMeds(false); }
    };

    useEffect(() => {
        if (medSearchTerm.length < 2) { setMedSuggestions([]); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await api.get(`/drugs/?search=${medSearchTerm}`);
                const existing = savedMeds.map(m => m.drug?.registration_number);
                setMedSuggestions(res.data.results.filter(d => !existing.includes(d.registration_number)));
            } catch (e) { console.error(e); }
        }, 300);
        return () => clearTimeout(timer);
    }, [medSearchTerm, savedMeds]);

    const addMedToProfile = async (drug) => {
        setAddingMed(true);
        try {
            await api.post('/medication-profile/', { drug_id: drug.id });
            setMedSearchTerm(""); setMedSuggestions([]); fetchSavedMeds();
        } catch (e) { console.error(e); }
        finally { setAddingMed(false); }
    };

    const removeMed = async (id) => {
        try { await api.delete(`/medication-profile/${id}/`); setSavedMeds(savedMeds.filter(m => m.id !== id)); }
        catch (e) { console.error(e); }
    };

    const handleFileDrop = (e) => {
        e.preventDefault(); setDragOver(false);
        const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
        if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) setUploadedFile(file);
    };

    const handleUploadScan = async () => {
        if (!uploadedFile) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            const res = await api.post('/medication-profile/scan/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const matches = res.data.matches || [];
            let addedCount = 0;
            const existingRegNums = savedMeds.map(m => m.drug?.registration_number);
            for (const match of matches) {
                if (match.match_score >= 80 && !existingRegNums.includes(match.drug.registration_number)) {
                    await api.post('/medication-profile/', { drug_id: match.drug.id });
                    addedCount++;
                    existingRegNums.push(match.drug.registration_number);
                }
            }
            alert(`Prescription scan complete. Extracted and saved ${addedCount} medications.`);
            fetchSavedMeds();
            setUploadedFile(null);
        } catch (error) {
            console.error("Scan failed:", error);
            alert("Failed to scan prescription. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const saveMedicalInfo = () => {
        localStorage.setItem('medsafe_medical_info', JSON.stringify(medicalInfo));
        setEditingMedInfo(false);
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-slate-500">Loading your profile...</p>
            </div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 text-center px-4">
            <p className="text-lg text-slate-500 mb-6 font-medium">Unable to load profile data.</p>
            <Button variant="default" onClick={() => navigate('/')}>Return Home</Button>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen py-16 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <Avatar className="w-28 h-28 border-4 border-white shadow-lg ring-1 ring-slate-100 flex items-center justify-center overflow-hidden">
                            {profile.profile_picture && <img src={profile.profile_picture} alt={profile.username} className="w-full h-full object-cover" />}
                            <AvatarFallback className="bg-primary text-white font-medium text-3xl">{profile.username?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">{profile.first_name || profile.username} {profile.last_name || ''}</h1>
                            <p className="text-sm text-slate-500 mb-3">@{profile.username}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 items-center">
                                <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium text-xs px-3 py-1">{profile.role?.replace('_', ' ')}</Badge>
                                {profile.wilaya && <Badge variant="outline" className="rounded-md text-xs font-medium gap-1"><MapPin className="w-3 h-3" />{profile.wilaya}</Badge>}
                                {profile.age && <Badge variant="outline" className="rounded-md text-xs font-medium">{profile.age} yrs</Badge>}
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => navigate('/settings')} className="rounded-lg h-11 px-6 font-medium border-slate-200 gap-2 shadow-none">
                            <Settings className="w-4 h-4" /> Settings
                        </Button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Saved Medications", value: savedMeds.length, icon: Pill, color: "emerald" },
                        { label: "Profile Status", value: "Active", icon: CheckCircle2, color: "blue" },
                        { label: "Risk Alerts", value: "0", icon: AlertTriangle, color: "amber" },
                        { label: "Last Check", value: "Today", icon: Clock, color: "slate" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact */}
                        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 pb-1"><CardTitle className="text-xs font-medium text-slate-400">Contact</CardTitle></CardHeader>
                            <CardContent className="pt-2 space-y-3">
                                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary shrink-0" /><span className="text-sm font-medium text-slate-900 break-all">{profile.email}</span></div>
                                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary shrink-0" /><span className="text-sm font-medium text-slate-900">{profile.phone || <span className="text-slate-400 italic">Not set</span>}</span></div>
                                {profile.wilaya && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary shrink-0" /><span className="text-sm font-medium text-slate-900">{profile.wilaya}</span></div>}
                            </CardContent>
                        </Card>

                        {/* Medical Info */}
                        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 pb-1 flex flex-row items-center justify-between">
                                <CardTitle className="text-xs font-medium text-slate-400">Medical Info</CardTitle>
                                <button onClick={() => editingMedInfo ? saveMedicalInfo() : setEditingMedInfo(true)} className="text-[10px] font-semibold text-primary hover:underline">
                                    {editingMedInfo ? 'Save' : 'Edit'}
                                </button>
                            </CardHeader>
                            <CardContent className="pt-2 space-y-3">
                                {[
                                    { key: 'blood_type', label: 'Blood Type', icon: Heart, placeholder: 'e.g. O+' },
                                    { key: 'allergies', label: 'Allergies', icon: AlertTriangle, placeholder: 'e.g. Penicillin' },
                                    { key: 'conditions', label: 'Conditions', icon: Activity, placeholder: 'e.g. Hypertension' },
                                    { key: 'emergency_contact', label: 'Emergency Contact', icon: Phone, placeholder: 'e.g. +213...' },
                                ].map(({ key, label, icon: Icon, placeholder }) => (
                                    <div key={key}>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1"><Icon className="w-3 h-3" />{label}</span>
                                        {editingMedInfo ? (
                                            <input
                                                value={medicalInfo[key]}
                                                onChange={(e) => setMedicalInfo({ ...medicalInfo, [key]: e.target.value })}
                                                placeholder={placeholder}
                                                className="w-full h-8 px-2 rounded border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-slate-900 pl-1">{medicalInfo[key] || <span className="text-slate-300 italic">Not set</span>}</p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* MedSafe card */}
                        <div className="bg-primary rounded-2xl p-6 text-primary-foreground shadow-primary/20 shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 opacity-[0.15] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500"><Shield className="w-32 h-32 text-white" /></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white/20 rounded-lg"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                                    <h4 className="font-semibold text-base text-white">MedSafe Protected</h4>
                                </div>
                                <Separator className="bg-primary-foreground/20 mb-3" />
                                <p className="text-primary-foreground/90 text-xs leading-relaxed font-medium">New prescriptions are automatically cross-checked against your saved profile.</p>
                            </div>
                        </div>
                    </div>

                    {/* Main: Medications */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100"><Pill className="w-5 h-5 text-emerald-600" /></div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">My Medications</h2>
                                        <p className="text-xs text-slate-500 font-medium">Long-term prescriptions saved to your profile</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{savedMeds.length} saved</span>
                            </div>

                            <div className="p-6">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Add Medication</p>

                                {/* Search */}
                                <div className="relative mb-4">
                                    <div className="relative">
                                        <input type="text" placeholder="Search by drug name..." value={medSearchTerm} onChange={(e) => setMedSearchTerm(e.target.value)}
                                            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                    {medSuggestions.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                                            {medSuggestions.map((drug, i) => (
                                                <button key={i} onClick={() => addMedToProfile(drug)} disabled={addingMed}
                                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-none transition-colors">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{drug.brand_name || drug.generic_name}</p>
                                                        <p className="text-[10px] text-slate-500">{drug.form} · {drug.dosage}</p>
                                                    </div>
                                                    <Plus className="w-4 h-4 text-emerald-500" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Upload */}
                                <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleFileDrop} onClick={() => fileInputRef.current?.click()}
                                    className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer mb-6 ${dragOver ? 'border-primary bg-primary/5' : uploadedFile ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/30 hover:border-slate-300'} ${uploadedFile ? 'px-4 py-3' : 'px-4 py-5'}`}>
                                    <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileDrop} className="hidden" />
                                    {uploadedFile ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><FileImage className="w-4 h-4 text-emerald-600" /></div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{uploadedFile.name}</p>
                                                    <p className="text-[10px] text-slate-500">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleUploadScan(); }} disabled={uploading}
                                                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-50">
                                                    {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} Scan
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }} className="p-1 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><Upload className="w-5 h-5 text-slate-400" /></div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Upload Prescription</p>
                                                <p className="text-[10px] text-slate-400">Drop an image or PDF to auto-extract medications</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Saved meds */}
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Saved Medications</p>
                                {loadingMeds ? (
                                    <div className="py-10 text-center"><Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" /><p className="text-xs text-slate-400">Loading...</p></div>
                                ) : savedMeds.length === 0 ? (
                                    <div className="py-10 text-center border border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                                        <Pill className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm text-slate-400 font-medium">No medications saved yet</p>
                                        <p className="text-xs text-slate-400 mt-1">Search or upload a prescription to add</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {savedMeds.map((med) => (
                                            <div key={med.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100"><Pill className="w-4 h-4 text-emerald-500" /></div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900 truncate">{med.drug?.brand_name || med.drug?.generic_name}</p>
                                                        <p className="text-[10px] text-slate-500 truncate">{med.drug?.form} · {med.drug?.dosage}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeMed(med.id)} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
