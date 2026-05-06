import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ScatterChart, Scatter, ZAxis, Cell
} from "recharts";
import {
    TrendingUp, Activity, Star, Award,
    Lightbulb, Clock, ChevronRight, Upload, FileText, CheckCircle2, AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({
        avgQuality: 0,
        total: 0,
        best: 0,
        lowest: 0
    });
    const [distribution, setDistribution] = useState([]);
    const [scatterData, setScatterData] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [csvResults, setCsvResults] = useState([]);
    const [csvLoading, setCsvLoading] = useState(false);
    const [csvError, setCsvError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/history/${user.uid}`);
                if (!response.ok) throw new Error("Failed to fetch history");
                const result = await response.json();
                const history = result.history || [];
                setData(history);
                processData(history);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setError("Could not load dashboard data. Please check your connection or backend status.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    const processData = (history) => {
        if (history.length === 0) return;

        const total = history.length;
        const sum = history.reduce((acc, curr) => acc + curr.quality, 0);
        const avg = (sum / total).toFixed(1);
        const best = Math.max(...history.map(h => h.quality));
        const lowest = Math.min(...history.map(h => h.quality));

        setStats({ avgQuality: avg, total, best, lowest });

        // Distribution
        const distMap = {};
        for (let i = 0; i <= 10; i++) distMap[i] = 0;
        history.forEach(h => {
            distMap[h.quality] = (distMap[h.quality] || 0) + 1;
        });
        const distData = Object.keys(distMap).map(k => ({ quality: k, count: distMap[k] }));
        setDistribution(distData);

        // Scatter Data (Alcohol vs Quality)
        const scatter = history.map(h => ({
            alcohol: h.features.alcohol,
            quality: h.quality
        }));
        setScatterData(scatter);

        // insights
        const newInsights = [];
        if (avg > 6) newInsights.push("Your recent wine selections show a high average quality profile.");

        const highAlcohol = history.filter(h => h.features.alcohol > 11);
        const highAlcoholAvg = highAlcohol.length > 0
            ? highAlcohol.reduce((acc, curr) => acc + curr.quality, 0) / highAlcohol.length
            : 0;

        if (highAlcoholAvg > avg) {
            newInsights.push("Higher alcohol values are improving quality scores in your dataset.");
        }

        const highAcidity = history.filter(h => h.features.volatileAcidity > 0.8);
        if (highAcidity.length > 0) {
            newInsights.push("High volatile acidity is lowering recent prediction scores.");
        } else {
            newInsights.push("Consistent acidity levels are maintaining stable quality predictions.");
        }

        setInsights(newInsights.slice(0, 3));
    };

    const handleCsvUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCsvLoading(true);
        setCsvError(null);
        setCsvResults([]);

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target.result;
                const lines = text.split('\n');
                if (lines.length < 2) throw new Error("CSV file is empty or missing data");

                const headers = lines[0].split(';').map(h => h.replace(/"/g, '').trim().toLowerCase());
                
                // Map headers to field names
                const headerMap = {
                    "fixed acidity": "fixedAcidity",
                    "volatile acidity": "volatileAcidity",
                    "citric acid": "citricAcid",
                    "residual sugar": "residualSugar",
                    "chlorides": "chlorides",
                    "free sulfur dioxide": "freeSulfurDioxide",
                    "total sulfur dioxide": "totalSulfurDioxide",
                    "density": "density",
                    "ph": "pH",
                    "sulphates": "sulphates",
                    "alcohol": "alcohol"
                };

                const batchData = [];
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const values = line.split(';');
                    const entry = { userId: user.uid };
                    
                    headers.forEach((header, index) => {
                        const fieldName = headerMap[header];
                        if (fieldName) {
                            entry[fieldName] = parseFloat(values[index]);
                        }
                    });
                    
                    // Basic validation: check if all required fields are present and are numbers
                    const requiredFields = Object.values(headerMap);
                    const isValid = requiredFields.every(field => typeof entry[field] === 'number' && !isNaN(entry[field]));
                    
                    if (isValid) {
                        batchData.push(entry);
                    }
                }

                if (batchData.length === 0) throw new Error("No valid data rows found in CSV. Ensure semicolon (;) delimiter and correct headers.");

                // Call bulk predict API
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/predict_bulk`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(batchData)
                });

                if (!response.ok) throw new Error("Failed to process CSV on server");
                
                const result = await response.json();
                setCsvResults(result.results || []);
                
                // Refresh main history after bulk upload
                const historyResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/history/${user.uid}`);
                if (historyResponse.ok) {
                    const historyResult = await historyResponse.json();
                    setData(historyResult.history || []);
                    processData(historyResult.history || []);
                }

            } catch (err) {
                console.error("CSV processing error:", err);
                setCsvError(err.message);
            } finally {
                setCsvLoading(false);
            }
        };
        reader.readAsText(file);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                type: "tween",
                ease: "easeOut",
                duration: 0.4
            }
        }
    };

    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "tween",
                ease: "easeOut",
                duration: 0.5
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
            <div className="text-wine animate-pulse">Loading Analytics...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-6 pt-24 md:p-12 md:pt-28 font-sans selection:bg-wine/30">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-8"
            >
                {/* Error Message */}
                {error && (
                    <motion.div
                        variants={itemVariants}
                        className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-center text-sm backdrop-blur-md"
                    >
                        {error}
                        <div className="mt-2 text-xs opacity-70">
                            Check if the backend is live at <a href={import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"} target="_blank" rel="noreferrer" className="underline">{import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}</a>
                        </div>
                    </motion.div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                            Predictive <span className="text-wine italic">Insights</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-gray-400 mt-2 text-lg">
                            Performance analysis of your wine quality predictions
                        </motion.p>
                    </div>
                    <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md text-gray-300">
                        <Clock size={16} className="text-wine" />
                        <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    </motion.div>
                </div>

                {/* CSV Upload Section */}
                <motion.div
                    variants={itemVariants}
                    className="bg-wine/5 border border-wine/20 backdrop-blur-2xl p-8 rounded-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-wine/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Upload className="text-wine" />
                                Batch Processing
                            </h2>
                            <p className="text-gray-400 mt-2">
                                Upload a CSV file with wine parameters to get bulk quality predictions. 
                                <span className="block text-xs mt-1 text-wine opacity-80">Use semicolon (;) as delimiter</span>
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                            <label className={`
                                flex items-center gap-3 px-8 py-4 rounded-2xl cursor-pointer transition-all
                                ${csvLoading ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-wine hover:bg-wine/90 text-white shadow-[0_0_30px_rgba(118,7,7,0.3)]"}
                            `}>
                                {csvLoading ? <Activity className="animate-spin" /> : <FileText />}
                                <span className="font-bold tracking-wide uppercase text-sm">
                                    {csvLoading ? "Processing Batch..." : "Upload CSV File"}
                                </span>
                                <input 
                                    type="file" 
                                    accept=".csv" 
                                    className="hidden" 
                                    onChange={handleCsvUpload} 
                                    disabled={csvLoading}
                                />
                            </label>
                            {csvError && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={14} /> {csvError}</span>}
                        </div>
                    </div>

                    {csvResults.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 border-t border-white/5 pt-8"
                        >
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-green-500" size={20} />
                                Batch Results ({csvResults.length} items processed)
                            </h3>
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-black/20 rounded-2xl p-4">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="text-gray-500 border-b border-white/5">
                                            <th className="pb-3 font-medium">Alcohol</th>
                                            <th className="pb-3 font-medium">pH</th>
                                            <th className="pb-3 font-medium">Density</th>
                                            <th className="pb-3 font-medium text-right">Predicted Quality</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {csvResults.map((res, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="py-3 text-gray-300">{res.features.alcohol}%</td>
                                                <td className="py-3 text-gray-300">{res.features.pH}</td>
                                                <td className="py-3 text-gray-300">{res.features.density}</td>
                                                <td className="py-3 text-right">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${res.quality >= 7 ? "bg-wine/30 text-wine" : "bg-white/10 text-gray-400"}`}>
                                                        {res.quality}/10
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Avg Quality", value: stats.avgQuality, icon: TrendingUp, color: "text-wine" },
                        { label: "Total Predictions", value: stats.total, icon: Activity, color: "text-neon-orange" },
                        { label: "Best Quality", value: stats.best, icon: Star, color: "text-yellow-400" },
                        { label: "Lowest Quality", value: stats.lowest, icon: Award, color: "text-blue-400" },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)", boxShadow: "0 0 20px rgba(118, 7, 7, 0.1)" }}
                            className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl flex flex-col justify-between group transition-all duration-300 border-l-4 border-l-transparent hover:border-l-wine"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
                                <stat.icon size={20} className={`${stat.color} group-hover:drop-shadow-[0_0_8px_currentColor] transition-all`} />
                            </div>
                            <div className="mt-4">
                                <span className="text-3xl font-bold tracking-tight text-white leading-none">
                                    {stat.value}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quality Distribution - Large Card */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-2xl relative overflow-hidden flex flex-col h-[450px]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-wine/10 blur-[80px] rounded-full -mr-10 -mt-10"></div>
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                            <Activity size={20} className="text-wine" />
                            Quality Distribution
                        </h3>
                        <div className="flex-grow w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={distribution} barCategoryGap="10%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="quality" stroke="#9ca3af" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#760707' }}
                                    />
                                    <Bar dataKey="count" fill="#760707" radius={[100, 100, 100, 100]} barSize={40}>
                                        {distribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={Number(entry.quality) >= 7 ? "#760707" : "#ffffff40"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* AI Insight Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-wine/5 border border-wine/20 backdrop-blur-2xl p-8 rounded-2xl flex flex-col h-[450px]"
                    >
                        <div className="h-10 w-10 bg-wine/20 rounded-lg flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(118, 7, 7, 0.2)]">
                            <Lightbulb size={24} className="text-wine" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-white">AI Predictions Insights</h3>
                        <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                            {insights.length > 0 ? insights.map((insight, i) => (
                                <div key={i} className="flex gap-4 text-sm text-gray-300 leading-relaxed border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div className="h-5 w-5 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <ChevronRight size={14} className="text-wine" />
                                    </div>
                                    <p>{insight}</p>
                                </div>
                            )) : (
                                <p className="text-gray-400 italic">Not enough data for insights yet. Keep predicting!</p>
                            )}
                        </div>
                        <button className="mt-8 w-full py-4 bg-wine text-white font-bold rounded-xl hover:bg-wine/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(118, 7, 7, 0.3)] uppercase tracking-wider text-xs">
                            Refresh Analysis
                        </button>
                    </motion.div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Scatter Plot - Alcohol vs Quality */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-2xl flex flex-col h-[400px]"
                    >
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                            <TrendingUp size={20} className="text-neon-orange" />
                            Alcohol vs Quality Analysis
                        </h3>
                        <div className="flex-grow w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis type="number" dataKey="alcohol" name="Alcohol" unit="%" stroke="#9ca3af" axisLine={false} />
                                    <YAxis type="number" dataKey="quality" name="Quality" stroke="#9ca3af" axisLine={false} />
                                    <ZAxis type="number" range={[60, 400]} />
                                    <Tooltip
                                        cursor={{ strokeDasharray: '3 3' }}
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Scatter name="Wines" data={scatterData} fill="#fb923c" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Recent Predictions Table */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/5 border border-white/10 backdrop-blur-2xl p-8 rounded-2xl overflow-hidden"
                    >
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                            <Clock size={20} className="text-gray-400" />
                            Recent Predictions
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-gray-500 border-b border-white/10">
                                        <th className="pb-4 font-medium">Alcohol</th>
                                        <th className="pb-4 font-medium">pH</th>
                                        <th className="pb-4 font-medium">Quality</th>
                                        <th className="pb-4 font-medium text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-white">
                                    {data.slice(0, 5).map((row, i) => (
                                        <motion.tr
                                            key={i}
                                            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                                            className="group transition-colors"
                                        >
                                            <td className="py-4 text-gray-300">{row.features.alcohol}%</td>
                                            <td className="py-4 text-gray-300">{row.features.pH}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.quality >= 7 ? "bg-wine/20 text-wine" : "bg-white/10 text-gray-400"
                                                    }`}>
                                                    {row.quality}/10
                                                </span>
                                            </td>
                                            <td className="py-4 text-right text-gray-500 tabular-nums">
                                                {new Date(row.timestamp).toLocaleDateString()}
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {data.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-gray-500">No predictions yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
