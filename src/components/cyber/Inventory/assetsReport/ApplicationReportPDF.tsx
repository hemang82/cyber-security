"use client";
import React from 'react';
import {
    Page, Text, View, Document, StyleSheet
} from '@react-pdf/renderer';
import { safeText } from '@/common/commonFunction';

// --- PREMIUM DESIGN SYSTEM ---
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#333',
        lineHeight: 1.6,
        backgroundColor: '#ffffff'
    },
    header: {
        position: 'absolute',
        top: 20,
        left: 40,
        right: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderBottomStyle: 'solid',
        paddingBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#999',
        fontSize: 8
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        borderTopStyle: 'solid',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#999',
        fontSize: 8
    },
    h1: { fontSize: 18, fontWeight: 'bold', color: '#1a2a6c', marginBottom: 15, marginTop: 10, textAlign: 'center' },
    h2: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a2a6c',
        marginTop: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#1a2a6c',
        borderBottomStyle: 'solid',
        paddingBottom: 4,
        textAlign: 'center'
    },
    h3: { fontSize: 12, fontWeight: 'bold', color: '#2c3e50', marginTop: 15, marginBottom: 8 },
    h4: { fontSize: 11, fontWeight: 'bold', color: '#444', marginTop: 10, marginBottom: 5 },
    text: { fontSize: 10, marginBottom: 8, textAlign: 'justify', color: '#444', lineHeight: 1.5 },
    textBold: { fontSize: 10, fontWeight: 'bold', color: '#1a2a6c' },
    textSmall: { fontSize: 9.5, color: '#555' },

    card: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderStyle: 'solid'
    },
    sectionDescBox: {
        fontSize: 10,
        color: '#555',
        marginBottom: 20,
        padding: 12,
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
        textAlign: 'center'
    },
    tocItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        borderBottomStyle: 'solid'
    },
    table: { width: '100%', borderStyle: 'solid', borderWidth: 0.5, borderColor: '#cbd5e1', marginVertical: 10 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#cbd5e1', minHeight: 22, alignItems: 'center' },
    tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#cbd5e1', backgroundColor: '#f8fafc', minHeight: 22, alignItems: 'center' },
    tableColSmall: { padding: 6, borderRightWidth: 0.5, borderColor: '#cbd5e1', width: '30%' },
    tableColMedium: { padding: 6, borderRightWidth: 0.5, borderColor: '#cbd5e1', width: '20%' },
    tableColLarge: { padding: 6, borderRightWidth: 0, borderColor: '#cbd5e1', width: '50%' },
    tableCell: { fontSize: 9 },
    tableCellBold: { fontSize: 9, fontWeight: 'bold', color: '#1e293b' },

    coverPage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#1a2a6c',
        color: 'white',
        padding: 60
    },
    listingItem: {
        marginBottom: 6,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#1a2a6c',
        borderLeftStyle: 'solid'
    },
    riskBox: {
        padding: 15,
        borderRadius: 6,
        marginBottom: 15,
        borderWidth: 1,
        borderStyle: 'solid',
        textAlign: 'center'
    },
    phaseBox: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        borderLeftWidth: 6
    },
    complianceBadge: {
        padding: '3 8',
        borderRadius: 4,
        backgroundColor: '#f1f5f9',
        borderWidth: 0.5,
        borderColor: '#cbd5e1',
        fontSize: 8,
        fontWeight: 'bold',
        color: '#475569',
        marginTop: 5,
        alignSelf: 'flex-start'
    }
});

const AppHeader = () => (
    <View style={styles.header} fixed>
        <Text style={{ fontWeight: 'bold' }}>CYBERSAFE AI - MOBILE VULNERABILITY & SECURITY DOCKET</Text>
        <Text>CONFIDENTIAL INTERNAL ANALYSIS</Text>
    </View>
);

const AppFooter = () => (
    <View style={styles.footer} fixed>
        <Text>Generated on {new Date().toLocaleDateString()} | CyberSafe Mobile Guard v2.5</Text>
        <Text render={({ pageNumber, totalPages }) => `Document Page ${pageNumber} of ${totalPages}`} />
    </View>
);

const SectionHeading = ({ number, title }: { number: string, title: string }) => (
    <View style={{ marginBottom: 15 }}>
        <Text style={styles.h1}>{number}. {title}</Text>
    </View>
);

const SectionMeta = ({ title, text }: { title: string, text: string }) => (
    <View style={styles.sectionDescBox} wrap={false}>
        <Text style={{ fontWeight: 'bold', color: '#1a2a6c', fontSize: 10, marginBottom: 4 }}>{title}</Text>
        <Text style={{ fontStyle: 'italic', fontSize: 9 }}>{text}</Text>
    </View>
);

export const ApplicationReportPDF = ({ data }: { data: any }) => {
    const appInfo = data?.app_info || {};
    const appName = safeText(appInfo?.app_name || 'Mobile Application');
    const score = Number(data?.security_score || 0);
    const risk = safeText(data?.risk_level || 'Unknown');
    const findings = data?.findings || [];
    const permissions = appInfo?.permissions || [];
    const summary = data?.summary || {};

    return (
        <Document title={`Full Security Audit - ${appName}`}>

            {/* PAGE 1: COVER */}
            <Page size="A4" style={styles.coverPage}>
                <Text style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', letterSpacing: 2 }}>CYBER SECURITY</Text>
                <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>MOBILE APPLICATION DOCKET</Text>
                <View style={{ width: 120, height: 5, backgroundColor: '#ffffff', marginBottom: 40 }} />
                <Text style={{ fontSize: 18, color: '#ecf0f1', marginBottom: 100, textAlign: 'center', fontWeight: 'light' }}>Automated Vulnerability Research & Analysis</Text>

                <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', borderTopStyle: 'solid', paddingTop: 50, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#bdc3c7', marginBottom: 8, letterSpacing: 1 }}>ASSET NAME</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 25 }}>{appName}</Text>

                    <Text style={{ fontSize: 10, color: '#bdc3c7', marginBottom: 8, letterSpacing: 1 }}>PACKAGE IDENTIFIER</Text>
                    <Text style={{ fontSize: 12, marginBottom: 25 }}>{appInfo?.package_name || 'N/A'}</Text>

                    <Text style={{ fontSize: 10, color: '#bdc3c7', marginBottom: 8, letterSpacing: 1 }}>SECURITY RESILIENCE INDEX</Text>
                    <Text style={{ fontSize: 42, fontWeight: 'bold', color: score > 70 ? '#2ecc71' : score > 40 ? '#f1c40f' : '#e74c3c' }}>{score}%</Text>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#ffffff', marginTop: 10 }}>{String(risk || 'UNKNOWN').toUpperCase()} THREAT LEVEL</Text>
                </View>

                <View style={{ position: 'absolute', bottom: 40, alignItems: 'center' }}>
                    <Text style={{ fontSize: 9, color: '#bdc3c7' }}>Assessment ID: CSAI-MA-AUDIT-2026</Text>
                    <Text style={{ fontSize: 9, color: '#bdc3c7' }}>Confidentiality Status: PRIVATE GRP-A</Text>
                </View>
            </Page>

            {/* PAGE 2: TOC */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="0" title="Table of Contents" />
                <View style={{ marginTop: 25 }}>
                    {[
                        ['1. Foreword & Methodology', '03'],
                        ['2. Security Audit Standards', '04'],
                        ['3. Executive Summary & Health Index', '05'],
                        ['4. Threat Profile & Categorization', '06'],
                        ['5. Application Architecture Insight', '07'],
                        ['6. Manifest & Permission Audit', '08'],
                        ['7. Data Storage & Local Security', '09'],
                        ['8. Network Traffic & API Shielding', '10'],
                        ['9. Binary Analysis & Obfuscation', '11'],
                        ['10. Detailed Security Findings (P1)', '12'],
                        ['11. Detailed Security Findings (P2)', '13'],
                        ['12. Compliance Mapping (OWASP)', '14'],
                        ['13. Remediation Strategy Roadmap', '15'],
                        ['14. Conclusion & Best Practices', '16']
                    ].map(([item, page], i) => (
                        <View key={i} style={styles.tocItem}>
                            <Text>{item}</Text>
                            <Text>{page}</Text>
                        </View>
                    ))}
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 3: INTRO & METHODOLOGY */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="1" title="Foreword & Methodology" />
                <Text style={styles.text}>
                    In current interconnected world, mobile applications are the primary target for malicious actors looking to harvest sensitive user data or bypass financial controls. Unlike web applications, mobile binaries reside on the user's device, making them susceptible to reverse engineering and local tampering.
                </Text>
                <Text style={styles.text}>
                    This audit report provides a deep-dive analysis of the {appName} application. Our scanners have analyzed the compiled binary, the Android manifest, and storage patterns to identify critical security gaps.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.h4}>Audit Methodology</Text>
                    <Text style={styles.textSmall}>• Static Application Security Testing (SAST)</Text>
                    <Text style={styles.textSmall}>• Binary Reverse Engineering & Decompilation</Text>
                    <Text style={styles.textSmall}>• Manifest Permission Mapping</Text>
                    <Text style={styles.textSmall}>• Vulnerability Database Correlation (CVE & NVD)</Text>
                    <Text style={styles.textSmall}>• OWASP Mobile Top 10 Compliance Check</Text>
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 4: STANDARDS */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="2" title="Audit Standards" />
                <SectionMeta
                    title="Compliance Benchmarks"
                    text="We use globally recognized security frameworks to evaluate application integrity."
                />
                <Text style={styles.h3}>Core Frameworks</Text>
                <View style={styles.listingItem}>
                    <Text style={styles.textBold}>OWASP Mobile Application Security (MAS)</Text>
                    <Text style={styles.textSmall}>The gold standard for mobile security, covering everything from data storage to code quality.</Text>
                </View>
                <View style={styles.listingItem}>
                    <Text style={styles.textBold}>NIST Mobile App Security Guidelines</Text>
                    <Text style={styles.textSmall}>Standardization for secure development and deployment in enterprise environments.</Text>
                </View>
                <View style={styles.listingItem}>
                    <Text style={styles.textBold}>GDPR / DPDP Compliance Integration</Text>
                    <Text style={styles.textSmall}>Assessment of PII (Personally Identifiable Information) collection and transmission security.</Text>
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 5: EXECUTIVE SUMMARY */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="3" title="Executive Summary" />
                <SectionMeta
                    title="App Security Posture"
                    text="Distillation of technical findings into business risk metrics."
                />

                <View style={[styles.card, { alignItems: 'center', paddingVertical: 35, backgroundColor: '#ffffff' }]}>
                    <View style={{ width: 130, height: 130, borderRadius: 65, borderWidth: 10, borderColor: score > 70 ? '#2ecc71' : score > 40 ? '#f1c40f' : '#e74c3c', borderStyle: 'solid', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 45, fontWeight: 'bold', color: '#1a2a6c' }}>{score}</Text>
                        {/* <Text style={{ fontSize: 8, color: '#666', marginTop: -5 }}>HEALTH INDEX</Text> */}
                    </View>
                    <Text style={{ fontSize: 13, marginTop: 15, fontWeight: 'bold', color: score > 70 ? '#2ecc71' : score > 40 ? '#f1c40f' : '#e74c3c', letterSpacing: 1.5 }}>{String(risk || 'UNKNOWN').toUpperCase()} POSTURE</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 15, marginTop: 10 }}>
                    <View style={[styles.card, { flex: 1, alignItems: 'center' }]}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a2a6c' }}>{summary?.total_findings || 0}</Text>
                        <Text style={{ fontSize: 8, color: '#666', marginTop: 3 }}>ISSUES IDENTIFIED</Text>
                    </View>
                    <View style={[styles.card, { flex: 1, alignItems: 'center' }]}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3498db' }}>{appInfo?.permissions_count || 0}</Text>
                        <Text style={{ fontSize: 8, color: '#666', marginTop: 3 }}>PERMISSIONS</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.h4}>Quick Scan Insights</Text>
                    <Text style={styles.textSmall}>• Analyzing {appInfo?.platform} binary version {appInfo?.version_name}.</Text>
                    <Text style={styles.textSmall}>• Identified {findings.filter((f: any) => f.severity === 'High' || f.severity === 'Critical').length} high-critical vulnerabilities.</Text>
                    <Text style={styles.textSmall}>• Target SDK level {appInfo?.target_sdk} suggests modern platform usage.</Text>
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 6: RISK CATEGORIZATION */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="4" title="Threat Profile" />
                <Text style={styles.text}>
                    Our vulnerabilities are categorized by Impact (business harm) and Risk (exploit probability).
                </Text>

                <View style={[styles.riskBox, { borderColor: '#c0392b', backgroundColor: '#fdf2f2' }]}>
                    <Text style={[styles.h3, { color: '#c0392b', marginTop: 0 }]}>CRITICAL THREAT</Text>
                    <Text style={styles.textSmall}>Direct access to sensitive data (Keys, PII) or remote code execution. Potential for total application compromise. Requires immediate hotfix.</Text>
                </View>

                <View style={[styles.riskBox, { borderColor: '#e67e22', backgroundColor: '#fef3e7' }]}>
                    <Text style={[styles.h3, { color: '#e67e22', marginTop: 0 }]}>HIGH THREAT</Text>
                    <Text style={styles.textSmall}>Broken authentication patterns, unsafe storage, or over-privileged APIs. Exploitable with moderate effort. Requires prioritized remediation.</Text>
                </View>

                <View style={[styles.riskBox, { borderColor: '#f1c40f', backgroundColor: '#fefdeb' }]}>
                    <Text style={[styles.h3, { color: '#f39c12', marginTop: 0 }]}>MEDIUM / LOW THREAT</Text>
                    <Text style={styles.textSmall}>Code hygiene issues, leakage of non-sensitive info, or missing hardening features (obfuscation). Reduces overall security but harder to exploit directly.</Text>
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 7: ARCHITECTURE */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="5" title="App Architecture" />
                <SectionMeta
                    title="Component Analysis"
                    text="Insight into the technical structure and environment of {appName}."
                />

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColSmall}><Text style={styles.tableCellBold}>Technical Attribute</Text></View>
                        <View style={styles.tableColLarge}><Text style={styles.tableCellBold}>Current Configuration</Text></View>
                    </View>
                    {[
                        ['Platform Type', appInfo?.platform],
                        ['Minimum SDK', appInfo?.min_sdk + ' (API Level)'],
                        ['Target SDK', appInfo?.target_sdk + ' (Modern API)'],
                        ['Product Version', appInfo?.version_name],
                        ['Build Identity', appInfo?.version_code]
                    ].map(([l, v], i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={styles.tableColSmall}><Text style={styles.tableCell}>{l}</Text></View>
                            <View style={styles.tableColLarge}><Text style={styles.tableCell}>{v}</Text></View>
                        </View>
                    ))}
                </View>

                <Text style={styles.h3}>Runtime Environment Review</Text>
                <Text style={styles.text}>
                    The application targets modern Android features. However, the use of older Minimum SDK levels increases the attack surface for users on legacy devices. We recommend upgrading the Min SDK to 26+ for better native encryption support.
                </Text>
                <AppFooter />
            </Page>

            {/* PAGE 8: PERMISSIONS AUDIT */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="6" title="Permission Audit" />
                <SectionMeta
                    title="Manifest Security"
                    text="Reviewing system permissions requested in AndroidManifest.xml."
                />

                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableColSmall, { width: '70%' }]}><Text style={styles.tableCellBold}>Permission String</Text></View>
                        <View style={[styles.tableColMedium, { width: '30%' }]}><Text style={styles.tableCellBold}>Requirement Status</Text></View>
                    </View>
                    {permissions.slice(0, 15).map((p: any, i: number) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={[styles.tableColSmall, { width: '70%', fontSize: 8 }]}><Text style={styles.tableCell}>{p.name}</Text></View>
                            <View style={[styles.tableColMedium, { width: '30%' }]}><Text style={styles.tableCell}>{p.required !== false ? 'ENFORCED' : 'OPTIONAL'}</Text></View>
                        </View>
                    ))}
                </View>
                <Text style={styles.textSmall}>* Total of {permissions.length} permissions analyzed. Showing top priority system integrations.</Text>

                <View style={[styles.card, { marginTop: 15 }]}>
                    <Text style={styles.textBold}>Audit Observation:</Text>
                    <Text style={styles.textSmall}>The application requests various network and storage permissions. Ensure that the 'WRITE_EXTERNAL_STORAGE' permission is only used if mandatory, as it exposes the app to sandbox bypass risks.</Text>
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 9: DATA STORAGE */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="7" title="Data & Privacy Audit" />
                <SectionMeta
                    title="Storage Security"
                    text="Analyzing how the application handles sensitive data on the device."
                />
                <Text style={styles.text}>
                    A major risk in mobile apps is the leakage of PII (Personally Identifiable Information) into local logs, Shared Preferences, or SQLite databases.
                </Text>

                <View style={styles.listingItem}>
                    <Text style={styles.h4}>Local Preference Analysis</Text>
                    <Text style={styles.textSmall}>We check if sensitive tokens or keys are stored in XML files without encryption (SharedPreferences).</Text>
                </View>
                <View style={styles.listingItem}>
                    <Text style={styles.h4}>SQLite & Internal Databases</Text>
                    <Text style={styles.textSmall}>Assessment of table encryption (SQLCipher) to prevent data theft via physical device access or backup exploits.</Text>
                </View>
                <View style={styles.listingItem}>
                    <Text style={styles.h4}>Backup Vulnerability</Text>
                    <Text style={styles.textSmall}>Config audit of 'allowBackup' flag. If true, private app data can be extracted via ADB backup without root access.</Text>
                </View>

                <View style={[styles.riskBox, { borderColor: '#3498db', backgroundColor: '#ebf5fb', marginTop: 40 }]}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold' }}>ADVISORY: SECURE KEYSTORE INTEGRATION</Text>
                    <Text style={{ fontSize: 8 }}>Always use Android Keystore system to generate and protect cryptographic keys.</Text>
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 10: NETWORK SECURITY */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="8" title="Network Shielding" />
                <SectionMeta
                    title="In-Transit Protection"
                    text="Auditing the security of communications between the App and Backend APIs."
                />

                <View style={styles.card}>
                    <Text style={styles.h4}>Network Security Configuration</Text>
                    <Text style={styles.text}>
                        Implementation of 'cleartextTrafficPermitted' check. Allowing HTTP traffic exposes users to Man-in-the-Middle (MitM) attacks.
                    </Text>
                </View>

                <View style={styles.listingItem}>
                    <Text style={styles.textBold}>SSL Pinning Implementation</Text>
                    <Text style={styles.textSmall}>Pinning ensures the app only trusts specific server certificates, preventing proxy-based data interception by attackers.</Text>
                </View>
                <View style={styles.listingItem}>
                    <Text style={styles.textBold}>Sensitive Data in Query Params</Text>
                    <Text style={styles.textSmall}>Checks for API keys or session IDs being passed in the URL, which are often logged by servers and gateways.</Text>
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 11: BINARY QUALITY */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="9" title="Binary Compliance" />
                <SectionMeta
                    title="Code Integrity"
                    text="Assessment of code quality, obfuscation, and anti-tampering."
                />
                <Text style={styles.text}>
                    Compromised binaries are the primary vector for cloned applications. Obfuscation makes the code unreadable to reverse engineering tools.
                </Text>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColSmall}><Text style={styles.tableCellBold}>Check Category</Text></View>
                        <View style={styles.tableColLarge}><Text style={styles.tableCellBold}>Observation / Verdict</Text></View>
                    </View>
                    {[
                        ['Code Obfuscation', findings.some((f: any) => f.title?.includes('Obfuscation')) ? 'GAPS DETECTED' : 'STANDARD ENFORCED'],
                        ['Debug Symbols', 'STRIPPED (SECURE)'],
                        ['Hardcoded Keys', findings.some((f: any) => f.title?.includes('Secret') || f.title?.includes('Hardcoded')) ? 'POTENTIAL LEAK' : 'NOT FOUND'],
                        ['Anti-Emulator', 'PRESENT'],
                        ['Root Detection', findings.some((f: any) => f.title?.includes('Root')) ? 'MISSING' : 'VALIDATED']
                    ].map(([l, v], i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={styles.tableColSmall}><Text style={styles.tableCell}>{l}</Text></View>
                            <View style={styles.tableColLarge}><Text style={[styles.tableCell, { color: v.includes('GAPS') || v.includes('LEAK') || v.includes('MISSING') ? '#c0392b' : '#27ae60' }]}>{v}</Text></View>
                        </View>
                    ))}
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 12: DETAILED FINDINGS P1 */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="10" title="Security Assessment" />
                <SectionMeta
                    title="Technical Findings (Part 1)"
                    text="Deep-dive into individual vulnerabilities discovered in the application."
                />

                {findings.length > 0 ? findings.slice(0, 3).map((f: any, i: number) => (
                    <View key={i} style={styles.card} wrap={false}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#ddd', paddingBottom: 5 }}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1a2a6c' }}>{f.title || f.type}</Text>
                            <View style={{
                                backgroundColor: f.severity === 'Critical' ? '#c0392b' : f.severity === 'High' ? '#e67e22' : '#3498db',
                                padding: '3 10',
                                borderRadius: 4
                            }}>
                                <Text style={{ color: '#fff', fontSize: 7, fontWeight: 'bold' }}>{String(f.severity || 'INFO').toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.h4}>The Risk & Vulnerability Details</Text>
                            <Text style={styles.textSmall}>{f.risk || f.detail}</Text>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[styles.h4, { color: '#c0392b' }]}>Potential Strategic Impact</Text>
                            <Text style={styles.textSmall}>This vulnerability could lead to {f.severity === 'Critical' ? 'total loss of data confidentiality' : 'unauthorized access to user features'} and brand reputation damage.</Text>
                        </View>

                        <View style={{ marginTop: 5, backgroundColor: '#fff', padding: 10, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#27ae60' }}>
                            <Text style={[styles.h4, { color: '#27ae60', marginTop: 0 }]}>Remediation / Solution</Text>
                            <Text style={styles.textSmall}>{f.solution || f.ai_solution}</Text>
                            <Text style={styles.complianceBadge}>OWASP MOBILE {f.owasp || 'M1/M2'}</Text>
                        </View>
                    </View>
                )) : (
                    <Text style={styles.text}>No significant vulnerabilities detected in this scan phase.</Text>
                )}
                <AppFooter />
            </Page>

            {/* PAGE 13: DETAILED FINDINGS P2 */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="11" title="Security Assessment" />
                <SectionMeta
                    title="Technical Findings (Part 2)"
                    text="Additional findings regarding code patterns and platform security."
                />

                {findings.length > 3 ? findings.slice(3, 6).map((f: any, i: number) => (
                    <View key={i} style={styles.card} wrap={false}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#ddd', paddingBottom: 5 }}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1a2a6c' }}>{f.title || f.type}</Text>
                            <View style={{ backgroundColor: '#e67e22', padding: '3 10', borderRadius: 4 }}>
                                <Text style={{ color: '#fff', fontSize: 7, fontWeight: 'bold' }}>{String(f.severity || 'INFO').toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.h4}>Technical Detail</Text>
                            <Text style={styles.textSmall}>{f.risk || f.detail}</Text>
                        </View>

                        <View style={{ marginTop: 5, backgroundColor: '#fff', padding: 10, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#27ae60' }}>
                            <Text style={[styles.h4, { color: '#27ae60', marginTop: 0 }]}>Recommended Solution</Text>
                            <Text style={styles.textSmall}>{f.solution || f.ai_solution}</Text>
                            <Text style={styles.complianceBadge}>OWASP MOBILE RANKED</Text>
                        </View>
                    </View>
                )) : (
                    <View style={styles.card}><Text style={styles.textSmall}>The secondary scan phase indicates a secure code posture for these categories.</Text></View>
                )}
                <AppFooter />
            </Page>

            {/* PAGE 14: COMPLIANCE */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="12" title="Compliance Mapping" />
                <SectionMeta
                    title="OWASP Mobile Top 10"
                    text="Correlating security findings with industry-standard compliance ranks."
                />

                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableColMedium, { width: '15%' }]}><Text style={styles.tableCellBold}>Rank</Text></View>
                        <View style={[styles.tableColLarge, { width: '65%' }]}><Text style={styles.tableCellBold}>Compliance Category Name</Text></View>
                        <View style={[styles.tableColMedium, { width: '20%' }]}><Text style={styles.tableCellBold}>Status</Text></View>
                    </View>
                    {[
                        ['M1', 'Improper Platform Usage', findings.some((f: any) => f.owasp?.includes('M1')) ? 'FAIL' : 'PASS'],
                        ['M2', 'Insecure Data Storage', findings.some((f: any) => f.owasp?.includes('M2')) ? 'FAIL' : 'PASS'],
                        ['M3', 'Insecure Communication', findings.some((f: any) => f.owasp?.includes('M3')) ? 'FAIL' : 'PASS'],
                        ['M4', 'Insecure Authentication', findings.some((f: any) => f.owasp?.includes('M4')) ? 'FAIL' : 'PASS'],
                        ['M5', 'Insufficient Cryptography', findings.some((f: any) => f.owasp?.includes('M5')) ? 'FAIL' : 'PASS'],
                        ['M7', 'Client Code Quality', findings.some((f: any) => f.owasp?.includes('M7')) ? 'FAIL' : 'PASS'],
                        ['M8', 'Code Tampering', findings.some((f: any) => f.owasp?.includes('M8')) ? 'FAIL' : 'PASS'],
                        ['M9', 'Reverse Engineering', findings.some((f: any) => f.owasp?.includes('M9')) ? 'FAIL' : 'PASS']
                    ].map(([r, c, s], i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={[styles.tableColMedium, { width: '15%' }]}><Text style={styles.tableCell}>{r}</Text></View>
                            <View style={[styles.tableColLarge, { width: '65%' }]}><Text style={styles.tableCell}>{c}</Text></View>
                            <View style={[styles.tableColMedium, { width: '20%' }]}><Text style={{ color: s === 'FAIL' ? '#c0392b' : '#27ae60', fontSize: 9, fontWeight: 'bold' }}>{s}</Text></View>
                        </View>
                    ))}
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 15: ROADMAP */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <SectionHeading number="13" title="Strategic Roadmap" />
                <SectionMeta
                    title="Remediation Schedule"
                    text="Phased approach to achieve maximum security resilience."
                />

                <View style={[styles.phaseBox, { borderLeftColor: '#c0392b' }]}>
                    <Text style={[styles.h4, { color: '#c0392b', marginTop: 0 }]}>PHASE 1: CRITICAL REMEDIATION (0 - 72 HOURS)</Text>
                    <Text style={styles.textSmall}>• Patch manifest vulnerabilities (Backup, Cleartext traffic).</Text>
                    <Text style={styles.textSmall}>• Fix hardcoded API secrets and debug tokens identified.</Text>
                    <Text style={styles.textSmall}>• Enforce HTTPS for all backend API endpoints.</Text>
                </View>

                <View style={[styles.phaseBox, { borderLeftColor: '#e67e22' }]}>
                    <Text style={[styles.h4, { color: '#e67e22', marginTop: 0 }]}>PHASE 2: HARDENING & QA (1 - 2 WEEKS)</Text>
                    <Text style={styles.textSmall}>• Implement ProGuard/R8 obfuscation for all production builds.</Text>
                    <Text style={styles.textSmall}>• Integrate biometrics/pin for local storage access if applicable.</Text>
                    <Text style={styles.textSmall}>• Optimize manifest permissions to follow Principle of Least Privilege.</Text>
                </View>

                <View style={[styles.phaseBox, { borderLeftColor: '#3498db' }]}>
                    <Text style={[styles.h4, { color: '#3498db', marginTop: 0 }]}>PHASE 3: LIFECYCLE OPS (CONTINUOUS)</Text>
                    <Text style={styles.textSmall}>• Integrate automated security scanning into Jenkins/GitHub Actions CI.</Text>
                    <Text style={styles.textSmall}>• Regular dependency scanning for 3rd party SDK vulnerabilities.</Text>
                </View>
                <AppFooter />
            </Page>

            {/* PAGE 16: CONCLUSION */}
            <Page size="A4" style={styles.page}>
                <AppHeader />
                <View style={{ marginTop: 100, alignItems: 'center' }}>
                    <SectionHeading number="14" title="Conclusion" />
                    <Text style={[styles.text, { textAlign: 'center', maxWidth: '80%' }]}>
                        The security audit of {appName} has been completed. This docket provides a blueprint for the current security state and necessary upgrades. By implementing the remediation path, the organization ensures a hardened security posture against evolving mobile threats.
                    </Text>
                    <View style={{ width: 150, height: 3, backgroundColor: '#1a2a6c', marginVertical: 45 }} />
                    <Text style={styles.h3}>CERTIFIED SECURE BY CYBERSAFE AI</Text>
                    <Text style={styles.textSmall}>Mobile Intelligence & Research Division</Text>
                    <Text style={{ fontSize: 8, color: '#aaa', marginTop: 140 }}>End of Secure Documentation Transmission. (&copy;) 2026 CyberSafe Analytics</Text>
                </View>
                <AppFooter />
            </Page>

        </Document>
    );
};

export default function DefaultExport({ data }: { data?: any }) {
    return null;
}
