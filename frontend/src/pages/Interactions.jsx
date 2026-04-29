import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, AlertTriangle, CheckCircle, AlertCircle, Info, Sparkles, ShieldCheck, Activity, Languages, Stethoscope } from 'lucide-react';
import api from '@/api/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock drug database for demo
const MOCK_DRUGS = [
    { id: 1, name: "Aspirine", brand: "Aspegic", type: "Antalgique" },
    { id: 2, name: "Ibuprofène", brand: "Advil", type: "AINS" },
    { id: 3, name: "Paracétamol", brand: "Doliprane", type: "Antalgique" },
    { id: 4, name: "Amoxicilline", brand: "Clamoxyl", type: "Antibiotique" },
    { id: 5, name: "Metformine", brand: "Glucophage", type: "Antidiabétique" },
    { id: 6, name: "Sintrom", brand: "Acénocoumarol", type: "Anticoagulant" },
    { id: 7, name: "Diclofénac", brand: "Voltarene", type: "AINS" },
    { id: 8, name: "Spasfon", brand: "Phloroglucinol", type: "Antispasmodique" },
];

const Interactions = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [results, setResults] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [searching, setSearching] = useState(false);

    // Fetch drug suggestions from backend
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }

            setSearching(true);
            try {
                const response = await api.get(`/drugs/?search=${searchTerm}`);
                // Ensure we don't suggest drugs already selected
                const filtered = response.data.results.filter(
                    drug => !selectedDrugs.find(sd => sd.registration_number === drug.registration_number)
                );
                setSuggestions(filtered);
            } catch (error) {
                console.error("Error searching drugs:", error);
            } finally {
                setSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedDrugs]);

    const addDrug = (drug) => {
        setSelectedDrugs([...selectedDrugs, drug]);
        setSearchTerm("");
        setSuggestions([]);
        setResults(null);
    };

    const removeDrug = (regNum) => {
        setSelectedDrugs(selectedDrugs.filter(d => d.registration_number !== regNum));
        setResults(null);
    };

    const analyzeInteractions = async () => {
        if (selectedDrugs.length < 2) return;

        setAnalyzing(true);
        try {
            // We only need the names for the analysis engine
            const drugNames = selectedDrugs.map(d => d.brand_name || d.generic_name);
            const response = await api.post("/interactions/analyze/", { drugs: drugNames });
            setResults(response.data);
        } catch (error) {
            console.error("Error analyzing interactions:", error);
            alert("Analysis failed. Please ensure the MedSafe engine is running.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 animate-in fade-in duration-700">
            <div className="flex flex-col items-center text-center mb-16 pt-8">

                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6 sm:text-6xl lg:text-7xl leading-[1.1]">
                    Verify Your <span className="text-bleu-900">Medications</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                    Check drug interactions against <span className="text-slate-900 font-bold">236,000+</span> clinical records.
                    Simplified explanations in <span className="text-primary font-bold">Algerian Darija</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Input */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-slate-100 shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                        <CardHeader className="bg-slate-50/80 pb-5 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold flex items-center gap-2.5">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Search className="w-4 h-4 text-primary" />
                                </div>
                                Add Medications
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-medium">Search by generic or brand name</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="relative group">
                                <Input
                                    placeholder="Search e.g. Doliprane..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-12 bg-slate-50/50 border-slate-200/60 focus:bg-white transition-all rounded-xl"
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />

                                {suggestions.length > 0 && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 ring-1 ring-black/5">
                                        <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestions</p>
                                            {searching && <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin"></div>}
                                        </div>
                                        {suggestions.map((drug, index) => (
                                            <button
                                                key={drug.registration_number || index}
                                                onClick={() => addDrug(drug)}
                                                className="w-full text-left px-4 py-3.5 hover:bg-primary/5 flex items-center justify-between group transition-colors border-b border-slate-50 last:border-none"
                                            >
                                                <div className="max-w-[80%]">
                                                    <p className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors truncate">{drug.brand_name || drug.generic_name}</p>
                                                    <p className="text-[10px] text-slate-500 truncate">{drug.form} • {drug.dosage}</p>
                                                </div>
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Selected List</h3>
                                {selectedDrugs.length === 0 ? (
                                    <div className="text-center py-10 px-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">No drugs added yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedDrugs.map((drug, index) => (
                                            <div key={drug.registration_number || index} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm animate-in zoom-in-95 duration-200">
                                                <div className="max-w-[70%]">
                                                    <p className="font-bold text-sm text-slate-900 truncate">{drug.brand_name || drug.generic_name}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium truncate">{drug.form}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeDrug(drug.registration_number)}
                                                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-slate-100/60 mt-6">
                                <Button
                                    className="w-full h-12 font-bold text-sm rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                                    disabled={selectedDrugs.length < 2 || analyzing}
                                    onClick={analyzeInteractions}
                                >
                                    {analyzing ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Running Engine...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Analyze Interactions
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/60 shadow-sm">
                        <div className="flex gap-3">
                            <div className="p-1.5 bg-blue-100 rounded-lg h-fit">
                                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                            </div>
                            <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                                <strong>Clinical Note:</strong> This tool uses the DDInter database. Results are for information only. Always consult a doctor.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-2 min-h-[500px]">
                    {!results && !analyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-16 bg-slate-50/40 rounded-[2.5rem] border-2 border-dashed border-slate-200/60 transition-all hover:bg-slate-50/60 group">
                            <div className="relative mb-8">
                                <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
                                <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 flex items-center justify-center border border-slate-50">
                                    <ShieldCheck className="w-12 h-12 text-primary/30 group-hover:text-primary/50 transition-colors" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                                    <Plus className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Ready to Analyze</h3>
                            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                                Add at least two medications to the list on the left to start checking for potential clinical interactions.
                            </p>
                        </div>
                    )}

                    {analyzing && (
                        <div className="h-full flex flex-col items-center justify-center p-20 space-y-6">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Activity className="w-8 h-8 text-primary animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Scanning DDInter...</h3>
                                <p className="text-sm text-slate-500 font-medium">Cross-checking {selectedDrugs.length} medication pairs</p>
                            </div>
                        </div>
                    )}

                    {results && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-2xl font-bold text-slate-900">Analysis Results</h3>
                                <Badge variant="secondary" className="bg-white border border-slate-100 text-slate-600 px-4 py-1 rounded-full font-bold shadow-sm">
                                    {results.explained_pairs?.length || 0} pairs analyzed
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                {results.explained_pairs?.map((res, idx) => (
                                    <Card key={idx} className="overflow-hidden border-none shadow-xl shadow-slate-200/40 rounded-3xl ring-2 ring-slate-100" style={{ ringColor: res.color + '33' }}>
                                        <div className="h-2 w-full" style={{ backgroundColor: res.color || '#94a3b8' }}></div>
                                        <CardContent className="p-0">
                                            <div className="p-7">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                                            <div className="px-4 py-2 bg-white rounded-xl font-bold text-sm shadow-sm">{res.drug_a}</div>
                                                            <div className="px-3">
                                                                <Activity className="w-4 h-4 text-slate-300" />
                                                            </div>
                                                            <div className="px-4 py-2 bg-white rounded-xl font-bold text-sm shadow-sm">{res.drug_b}</div>
                                                        </div>
                                                    </div>

                                                    <Badge className="text-white border-none px-5 py-2 rounded-xl font-bold text-xs shadow-lg" style={{ backgroundColor: res.color || '#94a3b8' }}>
                                                        {res.level}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="p-6 bg-slate-50/80 rounded-[2rem] border border-slate-100/50">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Languages className="w-4 h-4 text-primary" />
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Explication en Darija</p>
                                                        </div>
                                                        <p className="text-base font-bold text-slate-800 leading-relaxed text-right">
                                                            "{res.darija_explanation}"
                                                        </p>
                                                        {res.darija_risk_label && (
                                                            <div className="mt-3 flex justify-end">
                                                                <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5">{res.darija_risk_label}</Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-6 bg-slate-50/30 rounded-[2rem] border border-slate-100/30">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Stethoscope className="w-4 h-4 text-slate-400" />
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Insight (BioMistral)</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                                            {res.medical_explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-7 py-4 bg-slate-50/50 border-t border-slate-100/50 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: (res.color || '#94a3b8') + '22' }}>
                                                        {res.level === 'DANGER' ? <AlertTriangle className="w-4 h-4" style={{ color: res.color }} /> :
                                                            res.level === 'CAUTION' ? <AlertCircle className="w-4 h-4" style={{ color: res.color }} /> :
                                                                <CheckCircle className="w-4 h-4" style={{ color: res.color }} />}
                                                    </div>
                                                    <span className="text-xs font-extrabold tracking-tight uppercase" style={{ color: res.color || '#94a3b8' }}>
                                                        {res.level === 'DANGER' ? 'CRITICAL RISK DETECTED' :
                                                            res.level === 'CAUTION' ? 'MODERATE PRECAUTION' :
                                                                'PROCEED WITH CARE'}
                                                    </span>
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold hover:bg-white rounded-lg transition-all active:scale-95">
                                                    REPORT INCIDENT
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Interactions;
