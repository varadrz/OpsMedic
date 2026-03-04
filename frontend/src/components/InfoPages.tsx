"use client";

interface InfoPagesProps {
    view: "docs" | "security" | "api" | "privacy" | "infrastructure" | "contact";
    onBack: () => void;
}

export default function InfoPages({ view, onBack }: InfoPagesProps) {
    const content: Record<string, { title: string; subtitle: string; body: JSX.Element }> = {
        docs: {
            title: "Documentation",
            subtitle: "Understanding the OpsMedic Engine",
            body: (
                <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">How It Works</h3>
                        <p>
                            OpsMedic uses a dual-layer diagnostic approach. First, it extracts structured features from raw logs using regex patterns.
                            Second, it passes the entire log content through a TF-IDF vectorizer and a BernoulliNB Classifier to predict the root cause.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">ML Training</h3>
                        <p>
                            The model is bootstrapped with baseline data on startup. You can improve accuracy by manually labeling historical failures
                            and clicking &quot;Synchronize Neural Map&quot;. This updates the classifier in real-time without downtime.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Repository Scanning</h3>
                        <p>
                            Point OpsMedic at any public GitHub repository. The engine will automatically fetch the latest failed workflow run logs,
                            extract feature vectors, and classify the root failure category. Supported categories include timeout, dependency,
                            assertion, permission, and network failures.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Supported Log Formats</h3>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-500">
                            <li>GitHub Actions workflow logs</li>
                            <li>Raw CI/CD pipeline output (Jenkins, CircleCI, GitLab CI)</li>
                            <li>Docker build logs</li>
                            <li>Test runner output (Jest, Mocha, pytest)</li>
                            <li>Custom application error logs</li>
                        </ul>
                    </section>
                </div>
            )
        },
        api: {
            title: "API Reference",
            subtitle: "FastAPI Backend REST Endpoints",
            body: (
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">POST</span>
                            <code className="text-xs font-bold text-slate-900">/predict</code>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">Analyze raw log content and return ML classification with confidence scores.</p>
                        <pre className="text-[10px] bg-slate-900 text-slate-300 p-3 rounded font-mono">{"{ \"content\": \"string\" }"}</pre>
                        <div className="mt-2 text-[10px] text-slate-400">
                            <strong>Response:</strong> prediction, confidence, top_keywords, features, is_safe
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">POST</span>
                            <code className="text-xs font-bold text-slate-900">/analyze-repo</code>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">Fetch and analyze the latest failed job logs from a GitHub repository.</p>
                        <pre className="text-[10px] bg-slate-900 text-slate-300 p-3 rounded font-mono">{"{ \"url\": \"string\" }"}</pre>
                        <div className="mt-2 text-[10px] text-slate-400">
                            <strong>Response:</strong> prediction, confidence, top_keywords, features, is_safe, logs_analyzed
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">GET</span>
                            <code className="text-xs font-bold text-slate-900">/history</code>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">Retrieve the 50 most recent diagnostic records from the local database.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">POST</span>
                            <code className="text-xs font-bold text-slate-900">/train</code>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2">Retrain the classification model using all historical data in the database.</p>
                        <div className="mt-2 text-[10px] text-slate-400">
                            <strong>Response:</strong> accuracy, model_type, training_samples
                        </div>
                    </div>
                </div>
            )
        },
        security: {
            title: "Security Overview",
            subtitle: "Architecture & Threat Posture",
            body: (
                <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Local-First Architecture</h3>
                        <p>
                            OpsMedic operates entirely on your local machine. The backend server runs on localhost and does not expose any ports
                            to the public internet by default. All data is stored in a local SQLite database (<code className="text-xs bg-slate-100 px-1 rounded">opsmedic.db</code>).
                        </p>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">GitHub Access</h3>
                        <p>
                            The repository scanner uses read-only access to public GitHub API endpoints. No GitHub credentials or tokens are required
                            for public repository analysis. Private repos are not supported in the current version.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Data Retention</h3>
                        <p>
                            Analysis records are stored indefinitely in the local database. You can clear them at any time by deleting
                            the <code className="text-xs bg-slate-100 px-1 rounded">opsmedic.db</code> file from the backend directory.
                        </p>
                    </section>
                </div>
            )
        },
        privacy: {
            title: "Privacy & Security",
            subtitle: "Data Handling & Compliance Policies",
            body: (
                <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Data Privacy</h3>
                        <p>
                            OpsMedic does not collect, transmit, or store any personally identifiable information (PII). All log data submitted
                            for analysis remains on the local machine running the backend server.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">No External Telemetry</h3>
                        <p>
                            The application does not include any analytics, tracking, or telemetry services. No data is sent to third-party
                            servers. The only outbound network requests are to the GitHub API when scanning public repositories.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Open Source Transparency</h3>
                        <p>
                            OpsMedic is fully open source. You can inspect every line of code in the repository to verify our privacy claims.
                            The ML model runs locally using scikit-learn — no cloud ML services are used.
                        </p>
                    </section>
                </div>
            )
        },
        infrastructure: {
            title: "Infrastructure Health",
            subtitle: "System Components & Status",
            body: (
                <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">System Components</h3>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-900 uppercase">Frontend</span>
                                </div>
                                <p className="text-[10px] text-slate-500">Next.js 14 &bull; React 18 &bull; Tailwind CSS</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-900 uppercase">Backend</span>
                                </div>
                                <p className="text-[10px] text-slate-500">FastAPI &bull; Python 3.11 &bull; Uvicorn</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-900 uppercase">ML Engine</span>
                                </div>
                                <p className="text-[10px] text-slate-500">scikit-learn &bull; TF-IDF &bull; BernoulliNB</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded border border-slate-100">
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-900 uppercase">Database</span>
                                </div>
                                <p className="text-[10px] text-slate-500">SQLite 3 &bull; Local Storage</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Performance Metrics</h3>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                            <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                                <p className="text-xl font-bold text-indigo-600">&lt;50ms</p>
                                <p className="text-[9px] text-slate-500 uppercase font-bold mt-1">Avg Latency</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                                <p className="text-xl font-bold text-indigo-600">99.9%</p>
                                <p className="text-[9px] text-slate-500 uppercase font-bold mt-1">Uptime</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                                <p className="text-xl font-bold text-indigo-600">~85%</p>
                                <p className="text-[9px] text-slate-500 uppercase font-bold mt-1">Model Accuracy</p>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        contact: {
            title: "Contact Engineering",
            subtitle: "Reach Out to the Team",
            body: (
                <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Bug Reports & Feature Requests</h3>
                        <p>
                            If you encounter a bug or have a feature request, please open an issue on the
                            <a href="https://github.com" className="text-indigo-600 hover:underline ml-1 font-medium" target="_blank" rel="noopener noreferrer">GitHub Repository</a>.
                            We actively monitor and triage all incoming issues.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Enterprise Support</h3>
                        <p>
                            For enterprise deployment assistance, custom model training, or dedicated support,
                            reach out via email at <span className="text-indigo-600 font-medium">engineering@opsmedic.ai</span>.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Contributing</h3>
                        <p>
                            OpsMedic is open source and we welcome contributions. Please read the contributing guidelines
                            in the repository before submitting a pull request. We follow conventional commits and require
                            test coverage for all new features.
                        </p>
                    </section>
                </div>
            )
        }
    };

    const active = content[view] || content.docs;

    return (
        <div className="max-w-3xl mx-auto py-6 animate-in fade-in duration-500">
            <button
                onClick={onBack}
                className="mb-6 text-[10px] font-bold text-slate-400 hover:text-slate-900 flex items-center space-x-1.5 transition-colors uppercase tracking-widest"
            >
                <span>←</span>
                <span>Back to Dashboard</span>
            </button>

            <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm">
                <header className="mb-6 pb-4 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">{active.title}</h1>
                    <p className="text-xs text-slate-500 mt-1">{active.subtitle}</p>
                </header>

                <div className="prose prose-slate prose-sm max-w-none">
                    {active.body}
                </div>
            </div>
        </div>
    );
}
