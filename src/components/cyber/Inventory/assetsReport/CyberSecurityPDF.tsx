
"use client";
import React from 'react';
import {
    Page, Text, View, Document, StyleSheet,
    PDFDownloadLink, Image, Font
} from '@react-pdf/renderer';
// import { safeJoin } from './InventoryDetailsComponent';
import { safeText } from '@/common/commonFunction';
import { safeJoin } from '../assetsDetails/WebsiteDetails';

// Register a standard font if needed, otherwise use Helvetica
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

// --- PDF STYLES ---
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#333',
        lineHeight: 1.5,
        backgroundColor: '#ffffff'
    },
    header: {
        position: 'absolute',
        top: 20,
        left: 40,
        right: 40,
        borderBottom: '1px solid #eee',
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
        borderTop: '1px solid #eee',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#999',
        fontSize: 8
    },
    // Typography
    h1: { fontSize: 18, fontWeight: 'bold', color: '#1a2a6c', marginBottom: 20, marginTop: 10 },
    h2: { fontSize: 15, fontWeight: 'bold', color: '#1a2a6c', marginTop: 20, marginBottom: 15, paddingBottom: 5 },
    h3: { fontSize: 12, fontWeight: 'bold', color: '#2c3e50', marginTop: 15, marginBottom: 15 },
    h4: { fontSize: 10, fontWeight: 'bold', color: '#444', marginTop: 10, marginBottom: 10 },
    text: { fontSize: 8.5, marginBottom: 10, textAlign: 'justify', color: '#444' },
    textSmall: { fontSize: 9, color: '#666' },

    // Components
    card: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        border: '1px solid #e9ecef'
    },
    badge: {
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 8,
        color: 'white',
        backgroundColor: '#6c757d'
    },

    // Tables
    table: { width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', marginVertical: 8 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#bfbfbf', minHeight: 18, alignItems: 'center' },
    tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#bfbfbf', backgroundColor: '#f1f1f1', minHeight: 18, alignItems: 'center' },
    tableCol: { padding: 4, borderRightWidth: 1, borderColor: '#bfbfbf' },
    tableCell: { fontSize: 8 },
    tableCellBold: { fontSize: 8, fontWeight: 'bold' },

    // Special
    coverPage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#1a2a6c', // Dark Blue Background
        color: 'white'
    },
    coverTitle: { fontSize: 36, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center' },
    coverSubtitle: { fontSize: 18, color: '#ecf0f1', marginBottom: 60, textAlign: 'center' },
    coverInfo: { fontSize: 12, color: '#bdc3c7', marginBottom: 5 },

    // Scorecard
    scoreContainer: {
        alignItems: 'center',
        marginVertical: 20,
        padding: 30,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#e9ecef',
        width: '100%'
    },
    scoreCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: 'white'
    },
    scoreText: { fontSize: 32, fontWeight: 'bold', color: '#1a2a6c' },
    scoreLabel: { fontSize: 10, color: '#666', marginTop: -5 }
});

const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
        case 'CRITICAL': return '#c0392b'; // Dark Red
        case 'HIGH': return '#e67e22'; // Orange
        case 'MEDIUM': return '#f1c40f'; // Yellow
        case 'LOW': return '#27ae60'; // Green
        default: return '#7f8c8d'; // Grey
    }
};

// --- HELPER COMPONENTS ---
const SeverityBadge = ({ severity }: { severity: string }) => {
    // કલર લોજિક ફંક્શન
    const getBadgeColor = (sev: string) => {
        const s = sev?.toLowerCase();
        if (['critical', 'high risk'].includes(s)) return '#c0392b'; // Dark Red
        if (['high'].includes(s)) return '#e67e22';                 // Orange
        if (['medium', 'medium risk'].includes(s)) return '#f1c40f'; // Yellow
        if (['low', 'low risk'].includes(s)) return '#27ae60';       // Green
        if (['info'].includes(s)) return '#7f8c8d';                 // Grey
        return '#bdc3c7';                                            // Default Light Grey
    };

    const bgColor = getBadgeColor(severity);

    return (
        <View style={{
            backgroundColor: bgColor,
            paddingHorizontal: 8,      // થોડી વધુ સ્પેસ પ્રોફેશનલ લુક માટે
            paddingVertical: 3,
            borderRadius: 5,           // તમારી ઈમેજ મુજબ પ્રોપર રાઉન્ડ કોર્નર્સ
            alignSelf: 'flex-start',
            marginTop: 4,
            marginBottom: 4,
            minWidth: 55,              // બધા બેજની લંબાઈ જળવાઈ રહે તે માટે
            alignItems: 'center',
            display: 'flex'            // Flexbox નો ઉપયોગ
        }}>
            <Text style={{
                color: 'white',
                fontSize: 7,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 0.5      // ક્લેરિટી માટે
            }}>
                {severity || 'UNKNOWN'}
            </Text>
        </View>
    );
};

const Header = () => (
    <View style={styles.header} fixed>
        <Text>Confidential Security Assessment</Text>
        <Text>Generated via CyberSafe</Text>
    </View>
);

const Footer = () => (
    <View style={styles.footer} fixed>
        <Text>Sensitive Document - Do Not Distribute</Text>
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
);

const TableRow = ({ label, value }: { label: string, value: string | number }) => (
    <View style={styles.tableRow}>
        <View style={[styles.tableCol, { width: '35%' }]}>
            <Text style={styles.tableCellBold}>{label}</Text>
        </View>
        <View style={[styles.tableCol, { width: '65%', borderRightWidth: 0 }]}>
            <Text style={styles.tableCell}>{safeText(value)}</Text>
        </View>
    </View>
);

// --- MAIN PDF COMPONENT ---
export const PDFDocument = ({ data }: { data: any }) => {
    if (!data) return <Document><Page size="A4"><Text>No Data</Text></Page></Document>;

    const safeDate = (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A';

    // Group OWASP Entries
    const owaspEntries = data.compliance?.owasp_top_10 ? Object.entries(data.compliance.owasp_top_10) : [];

    const OWASP_DESCRIPTIONS: Record<string, string> = {
        "A01:2021-Broken Access Control": "Access control enforces policy such that users cannot act outside of their intended permissions. Failures typically lead to unauthorized information disclosure, modification, or destruction of all data or performing a business function outside the limits of the user.",
        "A02:2021-Cryptographic Failures": "Previously known as Sensitive Data Exposure, which is a symptom rather than a root cause. The focus is on failures related to cryptography which often leads to sensitive data exposure or system compromise.",
        "A03:2021-Injection": "Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query. The attacker's hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization.",
        "A04:2021-Insecure Design": "Accepting significant architectural flaws, A04 focuses on risks related to design flaws. If we want to 'move left' as an industry, it calls for more use of threat modeling, secure design patterns, and reference architectures.",
        "A05:2021-Security Misconfiguration": "This is commonly a result of insecure default configurations, incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers, and verbose error messages containing sensitive information.",
        "A06:2021-Vulnerable and Outdated Components": "Components, such as libraries, frameworks, and other software modules, run with the same privileges as the application. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover.",
        "A07:2021-Identification and Authentication Failures": "Confirmation of the user's identity, authentication, and session management is critical to protect against authentication-related attacks. Compromised passwords, keys, or session tokens can allow attackers to assume the identities of other users.",
        "A08:2021-Software and Data Integrity Failures": "Code and infrastructure that does not protect against integrity violations. This includes software updates, critical data, and CI/CD pipelines that can be tampered with, potentially leading to unauthorized code execution or compromise.",
        "A09:2021-Security Logging and Monitoring Failures": "Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response, allows attackers to further attack systems, maintain persistence, pivot to more systems, and tamper, extract, or destroy data.",
        "A10:2021-Server-Side Request Forgery (SSRF)": "SSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL. This allows an attacker to coerce the application to send a crafted request to an unexpected destination, even when protected by a firewall, VPN, or another type of network access control list (ACL)."
    };

    return (
        <Document title={`Security Report - ${data.target}`}>

            {/* --- PAGE 1: COVER PAGE --- */}
            <Page size="A4" style={styles.coverPage}>
                <View>
                    <Text style={styles.coverTitle}>VULNERABILITY{'\n'}ASSESSMENT REPORT</Text>
                    <Text style={styles.coverSubtitle}>Comprehensive Security Audit & Analysis</Text>

                    <View style={{ marginTop: 50, borderTop: '1px solid #bdc3c7', paddingTop: 20, width: 400, alignItems: 'center' }}>
                        <Text style={styles.coverInfo}>TARGET ASSET: {safeText(data.target)}</Text>
                        <Text style={styles.coverInfo}>SCAN DATE: {safeDate(data.scanned_at)}</Text>
                        <Text style={styles.coverInfo}>RISK LEVEL: {safeText(data.risk_level)}</Text>
                        <Text style={styles.coverInfo}>SECURITY SCORE: {safeText(data.security_score)}/100</Text>
                    </View>
                </View>
                <Text style={{ position: 'absolute', bottom: 50, fontSize: 10, color: '#bdc3c7' }}>CONFIDENTIAL - FOR INTERNAL USE ONLY</Text>
            </Page>

            {/* --- PAGE 2: TABLE OF CONTENTS --- */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>Table of Contents</Text>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.text}>1. Executive Summary</Text>
                    <Text style={styles.text}>2. Target Asset & Scope</Text>
                    <Text style={styles.text}>3. Domain Information</Text>
                    <Text style={styles.text}>4. Network & Infrastructure</Text>
                    <Text style={styles.text}>5. Performance & Security Headers</Text>
                    <Text style={styles.text}>6. OWASP Top 10 Compliance</Text>
                    <Text style={styles.text}>7. Detailed Vulnerability Breakdown</Text>
                    <Text style={styles.text}>8. Routes Scanned</Text>
                    <Text style={styles.text}>9. Recommendations & Roadmap</Text>
                    <Text style={styles.text}>10. Security Scorecard</Text>
                </View>
                <Footer />
            </Page>

            {/* --- PAGE 3: EXECUTIVE SUMMARY --- */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>1. Executive Summary</Text>
                <Text style={styles.text}>
                    This report provides a comprehensive analysis of the security posture of {safeText(data.target)}.
                    The assessment was conducted using automated scanning tools designed to identify common vulnerabilities,
                    misconfigurations, and compliance issues.
                </Text>
                <Text style={styles.text}>
                    The overall security score is {safeText(data.security_score)}/100, which is classified as {safeText(data.risk_level)}.
                    A total of {data.finding_counts?.reduce((acc: number, curr: any) => acc + (Number(curr.count) || 0), 0) || 0} issues were identified across various severity levels.
                </Text>

                {/* <View style={{ alignItems: 'center', marginVertical: 40 }}>
                    <Text style={{ fontSize: 60, fontWeight: 'bold', color: '#1a2a6c' }}>{data.security_score}</Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>OUT OF 100</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10, color: data.risk_level === 'Low Risk' ? 'green' : 'red' }}>{data.risk_level?.toUpperCase()}</Text>
                </View> */}

                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 30,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderColor: '#e5e7eb',
                        backgroundColor: '#f9fafb',
                        width: '100%',
                    }}
                >
                    {/* Title */}
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#111827',
                            marginBottom: 15,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                        }}
                    >
                        Overall Security Score
                    </Text>

                    {/* Score Circle Container */}
                    <View
                        style={{
                            width: 140,
                            height: 140,
                            borderRadius: 70,
                            borderWidth: 10,
                            borderStyle: 'solid',
                            backgroundColor: '#ffffff',

                            // ડાયનેમિક બોર્ડર કલર
                            borderColor:
                                data.risk_level === 'Low Risk' ? '#16a34a' :
                                    data.risk_level === 'Medium Risk' ? '#f59e0b' : '#dc2626',

                            // પેજની વચ્ચે સર્કલને સેટ કરવા માટે
                            alignSelf: 'center',
                            marginVertical: 20,

                            // અંદરના લખાણને સેન્ટર કરવા માટે સૌથી મહત્વની પ્રોપર્ટીઝ
                            display: 'flex',
                            alignItems: 'center',      // Horizontally center
                            justifyContent: 'center', // Vertically center
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 48,          // તમે જરૂર મુજબ વધારી-ઘટાડી શકો છો
                                fontWeight: 'bold',
                                color: '#1a2a6c',
                                textAlign: 'center',   // ટેક્સ્ટ એલાઈનમેન્ટ
                                lineHeight: 1,         // આ પ્રોપર્ટી સ્કોરને બરાબર મધ્યમાં રાખવામાં મદદ કરશે
                            }}
                        >
                            {safeText(data.security_score)}
                        </Text>
                    </View>
                    {/* Risk Level */}
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            marginTop: 10,
                            marginBottom: 10,
                            color:
                                data.risk_level === 'Low Risk'
                                    ? '#16a34a'
                                    : data.risk_level === 'Medium Risk'
                                        ? '#f59e0b'
                                        : '#dc2626',
                            textTransform: 'uppercase',
                        }}
                    >
                        {safeText(data.risk_level)}
                    </Text>

                    {/* Description */}
                    <Text
                        style={{
                            fontSize: 12,
                            color: '#374151',
                            marginTop: 8,
                            textAlign: 'center',
                            maxWidth: 350,
                            lineHeight: 1.5,
                        }}
                    >
                        This score represents the overall security posture of the assessed target
                        based on identified vulnerabilities, risk severity, and compliance checks.
                    </Text>
                </View>



                <Footer />
            </Page>

            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h3}>Risk Distribution</Text>

                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableCol, { width: '50%' }]}><Text style={styles.tableCellBold}>Severity</Text></View>
                        <View style={[styles.tableCol, { width: '50%', borderRightWidth: 0 }]}><Text style={styles.tableCellBold}>Count</Text></View>
                    </View>
                    {data.finding_counts?.map((item: any, i: number) => (
                        <View style={styles.tableRow} key={i}>
                            <View style={[styles.tableCol, { width: '50%' }]}>
                                <SeverityBadge severity={safeText(item.severity)} />
                            </View>
                            <View style={[styles.tableCol, { width: '50%', borderRightWidth: 0 }]}>
                                <Text style={styles.tableCell}>{safeText(item.count)}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styles.card}>
                    <Text style={styles.h3}>Analyst Note</Text>
                    <Text style={styles.text}>
                        Immediate attention is required for Critical and High severity issues.
                        These vulnerabilities pose a direct threat to the confidentiality, integrity, and availability of the system.
                    </Text>
                </View>
                <Footer />
            </Page>

            {/* --- PAGE 4: TARGET ASSET & SCOPE --- */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>2. Target Asset & Scope</Text>
                <Text style={styles.text}>
                    This section details the scope of the assessment and the specific asset that was scanned.
                    Understanding the target environment is crucial for validating findings and assessing impact.
                </Text>
                <Text style={styles.h3}>Asset Details</Text>
                <View style={styles.table}>
                    <TableRow label="Target URL" value={safeText(data.target)} />
                    <TableRow label="Scan Date" value={safeDate(data.scanned_at)} />
                    <TableRow label="Scan Type" value="Automated Blackbox Data Collection" />
                    <TableRow label="Scan Context" value={safeText(data.scan_context) || 'Standard Web Scan'} />
                </View>

                <Text style={styles.h3}>Methodology</Text>
                <Text style={styles.text}>
                    The assessment followed the OWASP (Open Web Application Security Project) testing guide methodology.
                    The process involved:
                </Text>
                <Text style={styles.text}>• Information Gathering (Passive & Active)</Text>
                <Text style={styles.text}>• Configuration Management Testing</Text>
                <Text style={styles.text}>• Injection Flaw Detection</Text>
                <Text style={styles.text}>• Weak Cryptography Analysis</Text>

                <View style={styles.card}>
                    <Text style={styles.h4}>Disclaimer</Text>
                    <Text style={styles.text}>
                        Automated scanners may produce false positives. All findings should be manually verified before applying remediation.
                        The absence of findings does not guarantee total security, as zero-day exploits or logic flaws may exist.
                    </Text>
                </View>
                <Footer />
            </Page>

            {/* --- PAGE 5: DOMAIN INFORMATION --- */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>3. Domain Information</Text>
                <Text style={styles.text}>
                    Domain intelligence helps identify ownership, registration details, and potential history of the asset.
                    Misconfigurations in domain settings can lead to hijacking or reputation damage.
                </Text>

                <View style={{ backgroundColor: '#f0f4f8', padding: 10, borderRadius: 5, marginBottom: 15 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1a2a6c', marginBottom: 5 }}> Why this matters?</Text>
                    <Text style={{ fontSize: 9, color: '#444' }}>
                        Publicly available WHOIS and DNS information can enable attackers to conduct social engineering,
                        identify hosting providers, and map out the organization&apos;s infrastructure.
                        Ensuring privacy protection and correct DNS records (like SPF/DMARC) relies on this data.
                    </Text>
                </View>

                <Text style={styles.h3}>Whois Data</Text>
                <View style={styles.table}>
                    <TableRow label="Registrar" value={data?.network_info?.whois?.registrar} />
                    <TableRow label="SSL Certificate" value={data?.website_security?.ssl_certificate?.valid
                        ? `${data.website_security.ssl_certificate.days_remaining} Days Valid`
                        : "Not Found"} />
                    <TableRow label="Expiry Date" value={safeDate(data.network_info?.whois?.expiry)} />
                    <TableRow label="A Records" value={safeJoin(data?.network_info?.dns_records?.A)} />
                    <TableRow label="MX Records" value={safeJoin(data?.network_info?.dns_records?.MX)} />
                    <TableRow label="TXT Records" value={safeJoin(data?.network_info?.dns_records?.TXT)} />
                    <TableRow label="Name Servers" value={safeJoin(data?.network_info?.dns_records?.NS)} />
                    <TableRow label="Whois" value={safeJoin(data?.network_info?.whois?.raw_partial)} />
                </View>

                {/* <Text style={styles.h3}>DNS Configuration</Text>
                <Text style={styles.text}>
                    Proper DNS configuration (SPF, DKIM, DMARC) is essential for email security and preventing spoofing.
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCellBold}>Type</Text></View>
                        <View style={[styles.tableCol, { width: '80%', borderRightWidth: 0 }]}><Text style={styles.tableCellBold}>Value</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>A Record</Text></View>
                        <View style={[styles.tableCol, { width: '80%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{data.network_info?.dns_records?.A?.join(', ') || 'N/A'}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>MX Record</Text></View>
                        <View style={[styles.tableCol, { width: '80%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{data.network_info?.dns_records?.MX?.map((mx: any) => mx.exchange).join(', ') || 'N/A'}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>DNSSEC</Text></View>
                        <View style={[styles.tableCol, { width: '80%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{data.network_info?.dns_records?.dnssec || 'Unsigned'}</Text></View>
                    </View>
                </View> */}
                <Footer />
            </Page>

            <Page size="A4" style={styles.page}>
                <Text style={styles.h3}>DNS Configuration</Text>
                <Text style={styles.text}>
                    Proper DNS configuration (SPF, DKIM, DMARC) is essential for email security and preventing spoofing.
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCellBold}>Type</Text></View>
                        <View style={[styles.tableCol, { width: '80%', borderRightWidth: 0 }]}><Text style={styles.tableCellBold}>Value</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>A Record</Text></View>
                        <View style={[styles.tableCol, { width: '80%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{data.network_info?.dns_records?.A?.join(', ') || 'N/A'}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>MX Record</Text></View>
                        <View style={[styles.tableCol, { width: '80%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{data.network_info?.dns_records?.MX?.map((mx: any) => mx.exchange).join(', ') || 'N/A'}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>DNSSEC</Text></View>
                        <View style={[styles.tableCol, { width: '80%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{data.network_info?.dns_records?.dnssec || 'Unsigned'}</Text></View>
                    </View>
                </View>
                <Footer />
            </Page>

            {/* --- PAGE 6: NETWORK INFORMATION --- */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>4. Network Information</Text>
                <Text style={styles.text}>
                    Network reconnaissance identifies exposed services and potential entry points.
                    Minimizing the attack surface by closing unnecessary ports is a fundamental security practice.
                </Text>

                <View style={{ backgroundColor: '#f0f4f8', padding: 10, borderRadius: 5, marginBottom: 15 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1a2a6c', marginBottom: 5 }}> Why this matters?</Text>
                    <Text style={{ fontSize: 9, color: '#444' }}>
                        Every open port is a potential door for an attacker. Services running on these ports may have vulnerabilities
                        or weak authentication. Knowing the server technology allows attackers to look for specific exploits (CVEs)
                        associated with that version.
                    </Text>
                </View>

                <Text style={styles.h3}>Host Details</Text>
                <View style={styles.table}>
                    <TableRow label="Host" value={data.network_info?.host} />
                    <TableRow label="IP" value={safeJoin(data?.network_info?.dns_records?.A)} />
                    <TableRow label="Server Technology" value={safeJoin(data?.website_security?.technologies)} />
                </View>

                <Text style={styles.h3}>Open Ports & Services</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCellBold}>Port</Text></View>
                        <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCellBold}>Service</Text></View>
                        <View style={[styles.tableCol, { width: '50%', borderRightWidth: 0 }]}><Text style={styles.tableCellBold}>Status</Text></View>
                    </View>
                    {data.network_info?.open_ports?.length > 0 ? (
                        data.network_info.open_ports.map((port: any, i: number) => (
                            <View style={styles.tableRow} key={i}>
                                <View style={[styles.tableCol, { width: '20%' }]}><Text style={styles.tableCell}>{port.port}</Text></View>
                                <View style={[styles.tableCol, { width: '30%' }]}><Text style={styles.tableCell}>{port.service || 'Unknown'}</Text></View>
                                <View style={[styles.tableCol, { width: '50%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{port.status}</Text></View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: '100%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>No open ports detected or firewall blocking scan.</Text></View>
                        </View>
                    )}
                </View>
                <Footer />
            </Page>

            {/* --- PAGE 7: PERFORMANCE & SECURITY HEADERS --- */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>5. Performance & Security Headers</Text>

                <Text style={styles.h3}>Performance Metrics</Text>
                <Text style={styles.text}>
                    Availability is a key component of the CIA triad. Slow loading times or heavy payloads can impact service availability.
                </Text>

                <View style={{ backgroundColor: '#f0f4f8', padding: 10, borderRadius: 5, marginBottom: 15 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1a2a6c', marginBottom: 5 }}>Why this matters?</Text>
                    <Text style={{ fontSize: 9, color: '#444' }}>
                        Slow websites frustrate users and may signal underlying infrastructure issues (like DoS vulnerability).
                        Security headers (HSTS, CSP, X-Frame-Options) tell the browser how to behave, preventing Cross-Site Scripting (XSS)
                        and Clickjacking attacks.
                    </Text>
                </View>
                <View style={styles.table}>
                    <TableRow label="Load Time" value={`${safeText(data.performance?.load_time_ms)} ms`} />
                    <TableRow label="Page Size" value={`${safeText(data.performance?.page_size_kb)} KB`} />
                    <TableRow label="Status" value={safeText(data?.performance?.status) || "-"} />
                    <TableRow label="Scripts (Inline/External)" value={`${safeText(data.performance?.script_analysis?.inline_script_count)} / ${safeText(data.performance?.script_analysis?.external_script_count)}`} />
                    <TableRow label="Sitemap XML" value={`${safeText(data?.seo_check?.sitemap_xml) || "0"}`} />
                    <TableRow label="Robots.txt" value={`${safeText(data?.seo_check?.robots_txt) || "0"}`} />
                    <TableRow label="Blacklisted" value={`${data?.summary?.blacklisted ? "Blacklisted Website" : "Not Blacklist"}`} />
                </View>

                <Text style={styles.h3}>Security Headers Analysis</Text>
                <Text style={styles.text}>
                    HTTP security headers provide an extra layer of security by restricting modern browser behaviors.
                </Text>
                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableCol, { width: '40%' }]}><Text style={styles.tableCellBold}>Header</Text></View>
                        <View style={[styles.tableCol, { width: '60%', borderRightWidth: 0 }]}><Text style={styles.tableCellBold}>Status</Text></View>
                    </View>
                    {data.website_security?.security_headers ? (
                        Object.entries(data.website_security.security_headers).map(([key, val]: any, i) => (
                            <View style={styles.tableRow} key={i}>
                                <View style={[styles.tableCol, { width: '40%' }]}><Text style={styles.tableCell}>{key}</Text></View>
                                <View style={[styles.tableCol, { width: '60%', borderRightWidth: 0 }]}>
                                    {/* <Text style={{ fontSize: 9, color: val.status === 'Present' ? 'green' : 'red' }}>{val.status}</Text> */}
                                    {/* Just showing value as string for now if it's an object */}
                                    <Text style={styles.tableCell}>{val.status || 'Missing'}</Text>
                                </View>
                            </View>
                        ))
                    ) : <Text style={styles.text}>No header data available.</Text>}
                </View>
                <Footer />
            </Page>

            {/* --- PAGES 8-18: OWASP TOP 10 (One page per category or grouped) --- */}
            {/* We will create a loop for the sections. */}
            <Page size="A4" style={styles.page} break>
                <Header />
                <Text style={styles.h1}>6. OWASP Top 10 Compliance</Text>
                <Text style={styles.text}>
                    The OWASP Top 10 is a standard awareness document for developers and web application security.
                    It represents a broad consensus about the most critical security risks to web applications.
                </Text>

                <View style={styles.table}>
                    <TableRow label="SSL/TLS Encryption" value={`${data?.website_security?.ssl_certificate?.valid ? "Valid" : "Invalid"} `} />
                    <TableRow label="Cookie Consent" value={`Check Required`} />
                    <TableRow label="OWASP Top 10" value={`Scanned`} />
                    <TableRow label="GDPR Basic Check" value={`Scanned`} />
                </View>
                <Footer />
            </Page>

            {owaspEntries.map(([category, details]: any, index) => (
                <Page size="A4" style={styles.page} key={index}>

                    <Header />

                    <Text style={styles.h2}>{category}</Text>

                    <View style={styles.card}>
                        <Text style={styles.h4}>Category Description</Text>
                        <Text style={styles.text}>
                            {OWASP_DESCRIPTIONS[category] || `This category covers security risks related to ${category}. Failures in this area can lead to serious compromises.`}
                        </Text>
                    </View>

                    <Text style={styles.h3}>Scan Findings</Text>
                    {details === 'Passed' ? (
                        <View style={{ backgroundColor: '#d4edda', padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: '#155724', fontWeight: 'bold' }}>✅ COMPLIANT</Text>
                            <Text style={styles.textSmall}>No automated vulnerabilities detected for this category.</Text>
                        </View>
                    ) : details?.length > 0 && (
                        <View style={{ backgroundColor: '#f8d7da', padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: '#721c24', fontWeight: 'bold' }}>❌ ISSUES DETECTED</Text>
                            {/* List Details if array */}
                            {Array.isArray(details) && details.map((risk: any, rIdx: number) => (
                                <View key={rIdx} style={{ marginTop: 5, borderBottom: '1px solid #f5c6cb', paddingBottom: 5 }}>
                                    <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{safeText(risk.type)}</Text>
                                    <Text style={styles.textSmall}>{safeText(risk.detail)}</Text>
                                    <Text style={{ fontSize: 8, color: '#444' }}>Fix: {safeText(risk.solution)}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <Text style={styles.h3}>Best Practices</Text>
                    <Text style={styles.text}>• Implement defense-in-depth strategies.</Text>
                    <Text style={styles.text}>• Regularly update dependencies and libraries.</Text>
                    <Text style={styles.text}>• Validate all user inputs on the server side.</Text>
                    <Text style={styles.text}>• Use least privilege principles for access control.</Text>

                    <Footer />
                </Page>
            ))}

            {/* --- PAGES 19-24: DETAILED VULNERABILITIES --- */}
            {data.network_info?.findings?.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <Header />
                    <Text style={styles.h1}>7. Detailed Vulnerability Breakdown</Text>
                    <Text style={styles.text}>
                        This section lists specific security flaws detected during the network and application scan.
                        Each finding allows developers to reproduce and patch the issue.
                    </Text>

                    <View style={{ backgroundColor: '#fff3cd', padding: 10, borderRadius: 5, marginBottom: 15 }}>
                        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#856404', marginBottom: 5 }}>⚠️ Remediation Guidance</Text>
                        <Text style={{ fontSize: 9, color: '#444' }}>
                            Prioritize patching Critical and High severity issues first. For each finding, review the &quot;Impact&quot; to understand
                            the business risk, and follow the &quot;Recommendation&quot; to apply the fix. Validate the fix by re-scanning.
                        </Text>
                    </View>
                    <Footer />
                </Page>
            )}

            {data.network_info?.findings?.map((finding: any, index: number) => (
                <Page size="A4" style={styles.page} key={`finding-${index}`}>
                    <Header />
                    <Text style={styles.h2}>Finding #{index + 1}: {safeText(finding.type) || safeText(finding.key)}</Text>

                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
                        <SeverityBadge severity={safeText(finding.severity)} />
                        <Text style={{ fontSize: 9, color: '#666' }}>{safeText(finding.owasp) || 'General Security'}</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.h4}>Description</Text>
                        <Text style={styles.text}>{safeText(finding.detail) || safeText(finding.desc) || 'No detailed description available.'}</Text>
                    </View>

                    <Text style={styles.h4}>Impact</Text>
                    <Text style={styles.text}>
                        {safeText(finding.impact) || 'Exploitation could lead to unauthorized actions or information disclosure.'}
                    </Text>

                    <Text style={styles.h4}>Recommendation</Text>
                    <Text style={styles.text}>
                        {safeText(finding.solution) || 'Apply standard security patches and configuration hardening.'}
                    </Text>

                    <Text style={styles.h4}>Evidence / Payload</Text>
                    <View style={{ backgroundColor: '#f1f1f1', padding: 10, borderRadius: 5 }}>
                        <Text style={{ fontFamily: 'Courier', fontSize: 8 }}>{safeText(finding.evidence) || 'N/A'}</Text>
                    </View>
                    <Footer />
                </Page>
            ))}

            {/* --- PAGE 25-27: ROUTES SCANNED --- */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>8. Routes Scanned</Text>
                <Text style={styles.text}>
                    The following URLs were crawled and audited. Ensuring full coverage of the application map is critical for a complete assessment.
                </Text>

                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableCol, { width: '80%' }]}><Text style={styles.tableCellBold}>URL Path</Text></View>
                        <View style={[styles.tableCol, { width: '20%', borderRightWidth: 0 }]}><Text style={styles.tableCellBold}>Issues</Text></View>
                    </View>
                    {data.route_scans?.map((route: any, i: number) => (
                        <View style={styles.tableRow} key={i}>
                            <View style={[styles.tableCol, { width: '80%' }]}><Text style={styles.tableCell}>{safeText(route.url)}</Text></View>
                            <View style={[styles.tableCol, { width: '20%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{safeText(route.vulnerabilities?.length) || 0}</Text></View>
                        </View>
                    ))}
                    {(!data.route_scans || data.route_scans.length === 0) && (
                        <View style={styles.tableRow}>
                            <View style={[styles.tableCol, { width: '100%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>No specific routes cataloged.</Text></View>
                        </View>
                    )}
                </View>
                {/* <Footer /> */}
            </Page>

            {/* --- PAGE 28-29: RECOMMENDATIONS --- */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>9. Recommendations & Roadmap</Text>
                <Text style={styles.text}>
                    Based on the findings, the following execution plan is recommended to improve the security posture.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.h3}>Priority 1: Critical Fixes (Immediate)</Text>
                    <Text style={styles.text}>• Patch all vulnerabilities labeled &apos;Critical&apos; or &apos;High&apos;.</Text>
                    <Text style={styles.text}>• Address SQL Injection and XSS flaws if present.</Text>
                    <Text style={styles.text}>• Ensure SSL/TLS is strictly enforced.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.h3}>Priority 2: Hardening (1-2 Weeks)</Text>
                    <Text style={styles.text}>• Implement missing security headers (CSP, HSTS).</Text>
                    <Text style={styles.text}>• Disable unnecessary ports and services.</Text>
                    <Text style={styles.text}>• Review and tighten file permissions.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.h3}>Priority 3: Maintenance (Ongoing)</Text>
                    <Text style={styles.text}>• Conduct regular automated scans.</Text>
                    <Text style={styles.text}>• Monitor server logs for suspicious activity.</Text>
                    <Text style={styles.text}>• Keep server software and libraries up to date.</Text>
                </View>
                <Footer />
            </Page>

            {/* --- PAGE 30: SCORECARD --- */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>10. Security Scorecard</Text>

                <View style={styles.scoreContainer}>
                    <View style={[styles.scoreCircle, { borderColor: data.security_score >= 80 ? '#28a745' : data.security_score >= 60 ? '#ffc107' : '#dc3545' }]}>
                        <Text style={styles.scoreText}>{data.security_score}</Text>
                        {/* <Text style={styles.scoreLabel}>/ 100</Text> */}
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', letterSpacing: 1, color: '#666' }}>SECURITY RATING</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 5, color: data.risk_level === 'Low Risk' ? '#28a745' : '#dc3545' }}>
                        {safeText(data.risk_level)?.toUpperCase()}
                    </Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCellBold}>Category</Text></View>
                        <View style={[styles.tableCol, { width: '30%', borderRightWidth: 0 }]}><Text style={styles.tableCellBold}>Rating</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCell}>Application Security (OWASP)</Text></View>
                        <View style={[styles.tableCol, { width: '30%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>
                            {data.finding_counts?.find((f: any) => f.severity === 'Critical' || f.severity === 'High') ? 'Needs Imp.' : 'Good'} </Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCell}>Network Security</Text></View>
                        <View style={[styles.tableCol, { width: '30%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{data.network_info?.open_ports?.length > 3 ? 'Fair' : 'Good'}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: '70%' }]}><Text style={styles.tableCell}>Encryption (SSL/TLS)</Text></View>
                        <View style={[styles.tableCol, { width: '30%', borderRightWidth: 0 }]}><Text style={styles.tableCell}>{data.website_security?.ssl_certificate?.valid ? 'Excellent' : 'Poor'}</Text></View>
                    </View>
                </View>

                <Text style={{ marginTop: 100, fontSize: 8, color: '#999', textAlign: 'center' }}>
                    Generated by CyberPortal Automated Security Assessment Tool.
                    {/* {'\n'}This report is strictly confidential and intended for the client only. */}
                </Text>
                <Footer />
            </Page>

        </Document>
    );
};

// --- PREVIEW / WRAPPER ---
export default function CyberSecurityPDFPage({ data }: { data?: any }) {
    if (!data) return null;
    return (
        <PDFDownloadLink
            document={<PDFDocument data={data} />}
            fileName={`Report-${new Date().toISOString().split('T')[0]}.pdf`}
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
            {({ loading }) => (loading ? 'Generating...' : 'Download Report')}
        </PDFDownloadLink>
    );
}