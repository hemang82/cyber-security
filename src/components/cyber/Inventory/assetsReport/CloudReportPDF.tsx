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
    h1: { fontSize: 16, fontWeight: 'bold', color: '#1a2a6c', marginBottom: 15, marginTop: 10, textAlign: 'center' },
    h2: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a2a6c',
        marginTop: 15,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#1a2a6c',
        borderBottomStyle: 'solid',
        paddingBottom: 4,
        textAlign: 'center'
    },
    h3: { fontSize: 11, fontWeight: 'bold', color: '#2c3e50', marginTop: 12, marginBottom: 8 },
    h4: { fontSize: 10, fontWeight: 'bold', color: '#444', marginTop: 8, marginBottom: 5 },
    text: { fontSize: 8.5, marginBottom: 8, textAlign: 'justify', color: '#444', lineHeight: 1.4 },
    textBold: { fontSize: 9.5, fontWeight: 'bold', color: '#1a2a6c' },
    textSmall: { fontSize: 8.5, color: '#666' },

    card: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderStyle: 'solid'
    },
    sectionDescBox: {
        fontSize: 8,
        color: '#555',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        textAlign: 'center'
    },
    tocItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        borderBottomStyle: 'solid'
    },
    table: { width: '100%', borderStyle: 'solid', borderWidth: 0.5, borderColor: '#cbd5e1', marginVertical: 8 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#cbd5e1', minHeight: 18, alignItems: 'center' },
    tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderColor: '#cbd5e1', backgroundColor: '#f8fafc', minHeight: 18, alignItems: 'center' },
    tableColSmall: { padding: 4, borderRightWidth: 0.5, borderColor: '#cbd5e1', width: '30%' },
    tableColStatus: { padding: 4, borderRightWidth: 0.5, borderColor: '#cbd5e1', width: '15%' },
    tableColLarge: { padding: 4, borderRightWidth: 0, borderColor: '#cbd5e1', width: '55%' },
    tableCell: { fontSize: 7.5 },
    tableCellBold: { fontSize: 7.5, fontWeight: 'bold', color: '#1e293b' },

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
        marginBottom: 4,
        paddingLeft: 8,
        borderLeftWidth: 1.5,
        borderLeftColor: '#1a2a6c',
        borderLeftStyle: 'solid'
    },
    riskBox: {
        padding: 10,
        borderRadius: 4,
        marginBottom: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        textAlign: 'center'
    },
    phaseBox: {
        padding: 12,
        backgroundColor: '#ffffff',
        borderRadius: 6,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        borderLeftWidth: 5
    }
});

const CloudHeader = () => (
    <View style={styles.header} fixed>
        <Text style={{ fontWeight: 'bold' }}>CYBERSAFE AI - CLOUD INFRASTRUCTURE SECURITY DOCKET</Text>
        <Text>CONFIDENTIAL INTERNAL ANALYSIS</Text>
    </View>
);

const CloudFooter = () => (
    <View style={styles.footer} fixed>
        <Text>Generated on {new Date().toLocaleDateString()} | System Integrity Assessed</Text>
        <Text render={({ pageNumber, totalPages }) => `Document Page ${pageNumber} of ${totalPages}`} />
    </View>
);

const SectionInfo = ({ title, text }: { title: string, text: string }) => (
    <View style={styles.sectionDescBox} wrap={false}>
        <Text style={{ fontWeight: 'bold', color: '#1a2a6c', fontSize: 10, marginBottom: 3 }}>{title}</Text>
        <Text style={{ fontStyle: 'italic', fontSize: 8.5 }}>{text}</Text>
    </View>
);

const ComplianceTable = ({ items, title }: { items: any[], title: string }) => (
    <View wrap={false} style={{ marginBottom: 20 }}>
        <Text style={styles.h3}>{title}</Text>
        <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
                <View style={styles.tableColSmall}><Text style={styles.tableCellBold}>Control Check</Text></View>
                <View style={styles.tableColStatus}><Text style={styles.tableCellBold}>Status</Text></View>
                <View style={styles.tableColLarge}><Text style={styles.tableCellBold}>Technical Detail</Text></View>
            </View>
            {items && items.length > 0 ? items.map((item: any, i: number) => (
                <View key={i} style={styles.tableRow}>
                    <View style={styles.tableColSmall}><Text style={styles.tableCell}>{item.check || 'N/A'}</Text></View>
                    <View style={styles.tableColStatus}>
                        <Text style={{ fontSize: 8, fontWeight: 'bold', color: String(item.status || '').toUpperCase() === 'PASS' ? '#27ae60' : String(item.status || '').toUpperCase() === 'FAIL' ? '#c0392b' : '#e67e22' }}>
                            {String(item.status || 'N/A').toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.tableColLarge}><Text style={styles.tableCell}>{item.detail || 'N/A'}</Text></View>
                </View>
            )) : (
                <View style={styles.tableRow}><Text style={{ padding: 10, fontSize: 8.5 }}>No data found for this category.</Text></View>
            )}
        </View>
    </View>
);

export const CloudReportPDF = ({ data }: { data: any }) => {
    // Default fallback values based on user's API response structure
    const provider = safeText(data?.cloud_provider || 'Cloud');
    const score = Number(data?.security_score ?? data?.summary?.score ?? 0);
    const risk = safeText(data?.summary?.risk_level || data?.cloud_security || 'Unknown');
    const summary = data?.summary || {};

    // Compliance breakdown from API Categories
    const iamComp = data?.compliance?.iam || [];
    const storageComp = data?.compliance?.storage || [];
    const networkComp = data?.compliance?.network || [];
    const loggingComp = data?.compliance?.logging || [];
    const metadataComp = data?.compliance?.metadata || [];
    const computeComp = data?.compliance?.compute || [];

    const inventory = data?.inventory || [];
    const findings = data?.findings || [];

    return (
        <Document title={`Full Security Docket - ${provider}`}>

            {/* PAGE 1: COVER */}
            <Page size="A4" style={styles.coverPage}>
                <Text style={{ fontSize: 42, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>CYBER SECURITY</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>CLOUD AUDIT REPORT</Text>
                <View style={{ width: 100, height: 4, backgroundColor: '#ffffff', marginBottom: 40 }} />
                <Text style={{ fontSize: 18, color: '#ecf0f1', marginBottom: 80, textAlign: 'center' }}>Enterprise Infrastructural Integrity Analysis</Text>

                <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', borderTopStyle: 'solid', paddingTop: 40, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#bdc3c7', marginBottom: 5 }}>PROVIDER / ENVIRONMENT</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>{provider}</Text>

                    <Text style={{ fontSize: 10, color: '#bdc3c7', marginBottom: 5 }}>SECURITY HEALTH SCORE</Text>
                    <Text style={{ fontSize: 32, fontWeight: 'bold', color: score > 70 ? '#2ecc71' : score > 40 ? '#f1c40f' : '#e74c3c' }}>{score}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff', marginTop: 5 }}>{String(risk || 'UNKNOWN').toUpperCase()} POSTURE</Text>
                </View>

                <View style={{ position: 'absolute', bottom: 40, alignItems: 'center' }}>
                    <Text style={{ fontSize: 8, color: '#bdc3c7' }}>Document ID: CSAI-AUDIT-2026-EN</Text>
                    <Text style={{ fontSize: 8, color: '#bdc3c7' }}>Security Classification: TOP SECRET / CONFIDENTIAL</Text>
                </View>
            </Page>

            {/* PAGE 2: TOC */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>Table of Contents</Text>
                <View style={{ marginTop: 20 }}>
                    <View style={styles.tocItem}><Text>1. Foreword & Introduction</Text><Text>03</Text></View>
                    <View style={styles.tocItem}><Text>2. Audit Methodology & Standards</Text><Text>04</Text></View>
                    <View style={styles.tocItem}><Text>3. Executive Summary & Health Index</Text><Text>05</Text></View>
                    <View style={styles.tocItem}><Text>4. Risk Categorization Profile</Text><Text>06</Text></View>
                    <View style={styles.tocItem}><Text>5. Governance & Compliance (IAM)</Text><Text>07</Text></View>
                    <View style={styles.tocItem}><Text>6. Governance & Compliance (Storage)</Text><Text>08</Text></View>
                    <View style={styles.tocItem}><Text>7. Governance & Compliance (Network)</Text><Text>09</Text></View>
                    <View style={styles.tocItem}><Text>8. Governance & Compliance (Logging & Ops)</Text><Text>10</Text></View>
                    <View style={styles.tocItem}><Text>9. Resource Inventory Matrix (P1)</Text><Text>11</Text></View>
                    <View style={styles.tocItem}><Text>10. Resource Inventory Matrix (P2)</Text><Text>12</Text></View>
                    <View style={styles.tocItem}><Text>11. Detailed Security Findings (P1)</Text><Text>13</Text></View>
                    <View style={styles.tocItem}><Text>12. Detailed Security Findings (P2)</Text><Text>14</Text></View>
                    <View style={styles.tocItem}><Text>13. Detailed Security Findings (P3)</Text><Text>15</Text></View>
                    <View style={styles.tocItem}><Text>14. Remediation Strategy Roadmap</Text><Text>16</Text></View>
                    <View style={styles.tocItem}><Text>15. Best Practices - IAM & MFA</Text><Text>17</Text></View>
                    <View style={styles.tocItem}><Text>16. Best Practices - Data & Backup</Text><Text>18</Text></View>
                    <View style={styles.tocItem}><Text>17. Best Practices - Network Shielding</Text><Text>19</Text></View>
                    <View style={styles.tocItem}><Text>18. Conclusion</Text><Text>20</Text></View>
                </View>
                <CloudFooter />
            </Page>

            {/* PAGE 3: INTRODUCTION */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>1. Foreword & Introduction</Text>
                <Text style={styles.text}>
                    In the modern digital landscape, the cloud has become the backbone of enterprise operations. However, this shift also brings significant security challenges. As organizations scale their infrastructure within {provider}, the complexity of managing permissions, storage buckets, and networking increases exponentially.
                </Text>
                <Text style={styles.text}>
                    This audit document provides a comprehensive analysis of your {provider} environment. our goal is to uncover hidden risks, evaluate compliance with industry standards, and provide a clear roadmap for hardening your security posture.
                </Text>
                <View style={styles.card}>
                    <Text style={styles.h4}>Audit Scope Analysis</Text>
                    <Text style={styles.textSmall}>• Global Identity &amp; Access Management (IAM)</Text>
                    <Text style={styles.textSmall}>• Publicly Exposed Storage (S3/Buckets)</Text>
                    <Text style={styles.textSmall}>• Database Access Controls &amp; Encryption</Text>
                    <Text style={styles.textSmall}>• Network Security Groups &amp; Firewall Rules</Text>
                    <Text style={styles.textSmall}>• Logging, Monitoring &amp; Audit Trails</Text>
                </View>
                <CloudFooter />
            </Page>

            {/* PAGE 4: METHODOLOGY */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>2. Audit Methodology</Text>
                <SectionInfo
                    title="Automated Intelligence Gathering"
                    text="We use advanced automated scanners to crawl every accessible corner of your cloud infrastructure, comparing configurations against the CIS Benchmarks and NIST frameworks."
                />
                <Text style={styles.h3}>Security Benchmarks</Text>
                <View style={styles.listingItem}><Text style={styles.textSmall}>• CIS {provider} Foundations Benchmark v2.1.0</Text></View>
                <View style={styles.listingItem}><Text style={styles.textSmall}>• NIST Special Publication 800-210 (Cloud Security)</Text></View>
                <View style={styles.listingItem}><Text style={styles.textSmall}>• HIPAA &amp; SOC2 Infrastructure Compliance</Text></View>
                <Text style={styles.h3}>Scoring Algorithm</Text>
                <Text style={styles.text}>
                    The security score is calculated based on the ratio of passed security checks. Critical failures (such as unprotected root accounts or public database ports) have a significantly higher negative weight on the overall health index.
                </Text>
                <CloudFooter />
            </Page>

            {/* PAGE 5: EXECUTIVE SUMMARY */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>3. Executive Summary</Text>
                <SectionInfo
                    title="Enterprise Infrastructure Snapshot"
                    text="The health index represents a mathematical distillation of your security posture."
                />

                <View style={[styles.card, { alignItems: 'center', paddingVertical: 30, backgroundColor: '#ffffff' }]}>
                    <View style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 8, borderColor: score > 70 ? '#2ecc71' : score > 40 ? '#f1c40f' : '#e74c3c', borderStyle: 'solid', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#1a2a6c' }}>{score}</Text>
                        {/* <Text style={{ fontSize: 8, color: '#666', marginTop: -2 }}></Text> */}
                    </View>
                    <Text style={{ fontSize: 13, marginTop: 15, fontWeight: 'bold', color: score > 70 ? '#2ecc71' : score > 40 ? '#f1c40f' : '#e74c3c', letterSpacing: 1 }}>{String(risk || 'UNKNOWN').toUpperCase()} POSTURE</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                    <View style={[styles.card, { flex: 1, alignItems: 'center' }]}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1a2a6c' }}>{summary.checks_performed || 0}</Text>
                        <Text style={{ fontSize: 7, color: '#666', marginTop: 2 }}>CHECKS</Text>
                    </View>
                    <View style={[styles.card, { flex: 1, alignItems: 'center' }]}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1a2a6c' }}>{summary.resources_scanned || 0}</Text>
                        <Text style={{ fontSize: 7, color: '#666', marginTop: 2 }}>RESOURCES</Text>
                    </View>
                    <View style={[styles.card, { flex: 1, alignItems: 'center' }]}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#e74c3c' }}>{summary.issues_found || 0}</Text>
                        <Text style={{ fontSize: 7, color: '#666', marginTop: 2 }}>ISSUES</Text>
                    </View>
                </View>

                <View style={[styles.card, { marginTop: 10 }]}>
                    <Text style={styles.h4}>Quick Analysis</Text>
                    <Text style={styles.textSmall}>• Infrastructure categorization: {provider} Environment</Text>
                    <Text style={styles.textSmall}>• Assessment Type: Automated Governance Scan</Text>
                    <Text style={styles.textSmall}>• Scan Status: {data?.scan_status || 'Complete'}</Text>
                </View>
                <CloudFooter />
            </Page>

            {/* PAGE 6: RISK PROFILES */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>4. Risk Categorization</Text>
                <Text style={styles.text}>
                    We categorize risks based on their potential for business disruption and data theft.
                </Text>

                <View style={[styles.riskBox, { borderColor: '#c0392b', backgroundColor: '#fdf2f2' }]}>
                    <Text style={[styles.h3, { color: '#c0392b', marginTop: 0 }]}>CRITICAL RISK</Text>
                    <Text style={styles.textSmall}>Immediate threats to infrastructure sovereignty. Requires instant remediation. Includes public storage, open admin ports, and unencrypted sensitive databases.</Text>
                </View>

                <View style={[styles.riskBox, { borderColor: '#e67e22', backgroundColor: '#fef3e7' }]}>
                    <Text style={[styles.h3, { color: '#e67e22', marginTop: 0 }]}>HIGH RISK</Text>
                    <Text style={styles.textSmall}>Violation of the principle of least privilege. Potential for lateral movement or data exfiltration via over-permissive IAM roles or network configurations.</Text>
                </View>

                <View style={[styles.riskBox, { borderColor: '#f1c40f', backgroundColor: '#fefdeb' }]}>
                    <Text style={[styles.h3, { color: '#f39c12', marginTop: 0 }]}>MEDIUM / INFO</Text>
                    <Text style={styles.textSmall}>Technical hygiene issues or informational alerts. Includes missing resource tags, non-critical encryption gaps, or legacy API versions still in use.</Text>
                </View>
                <CloudFooter />
            </Page>

            {/* PAGE 7: IAM COMPLIANCE */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>5. Governance: IAM</Text>
                <SectionInfo
                    title="Identity Management"
                    text="Auditing how entities are allowed to interact with your cloud resources."
                />
                <ComplianceTable items={iamComp} title="Access &amp; Authentication Controls" />
                <CloudFooter />
            </Page>

            {/* PAGE 8: STORAGE COMPLIANCE */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>6. Governance: Storage</Text>
                <SectionInfo
                    title="Data Sovereignty"
                    text="Detailed check of object storage buckets and data volume snapshots."
                />
                <ComplianceTable items={storageComp} title="Object Storage &amp; Backup Checks" />
                <CloudFooter />
            </Page>

            {/* PAGE 9: NETWORK COMPLIANCE */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>7. Governance: Networking</Text>
                <SectionInfo
                    title="Network Security"
                    text="Analyzing Virtual Private Cloud (VPC) and Security Group configurations."
                />
                <ComplianceTable items={networkComp} title="Firewall &amp; Traffic Audit" />
                <CloudFooter />
            </Page>

            {/* PAGE 10: LOGGING & OPS COMPLIANCE */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>8. Governance: Operations</Text>
                <SectionInfo
                    title="Audit & Oversight"
                    text="Verifying visibility through CloudTrail, GuardDuty, and Config recording."
                />
                <ComplianceTable items={loggingComp} title="Logging &amp; Intrusion Detection" />
                <ComplianceTable items={computeComp} title="Compute Instance Hygiene" />
                <ComplianceTable items={metadataComp} title="Metadata &amp; Service Audit" />
                <CloudFooter />
            </Page>

            {/* PAGE 11: INVENTORY P1 */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>9. Resource Inventory</Text>
                <SectionInfo
                    title="Asset Discovery"
                    text="Listing of all uniquely identified resources in the scanned environment."
                />
                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableColSmall, { width: '35%' }]}><Text style={styles.tableCellBold}>Entity Name</Text></View>
                        <View style={[styles.tableColStatus, { width: '20%' }]}><Text style={styles.tableCellBold}>Type</Text></View>
                        <View style={[styles.tableColLarge, { width: '45%' }]}><Text style={styles.tableCellBold}>Identifier</Text></View>
                    </View>
                    {inventory.slice(0, 15).map((res: any, i: number) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={[styles.tableColSmall, { width: '35%' }]}><Text style={styles.tableCell}>{res.name || 'Resource'}</Text></View>
                            <View style={[styles.tableColStatus, { width: '20%' }]}><Text style={styles.tableCell}>{res.type || 'N/A'}</Text></View>
                            <View style={[styles.tableColLarge, { width: '45%' }]}><Text style={styles.tableCell}>{res.resource_id || 'ID UNKNOWN'}</Text></View>
                        </View>
                    ))}
                </View>
                <CloudFooter />
            </Page>

            {/* PAGE 12: INVENTORY P2 */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h2}>10. Resource Inventory (Cont.)</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={[styles.tableColSmall, { width: '35%' }]}><Text style={styles.tableCellBold}>Entity Name</Text></View>
                        <View style={[styles.tableColStatus, { width: '20%' }]}><Text style={styles.tableCellBold}>Type</Text></View>
                        <View style={[styles.tableColLarge, { width: '45%' }]}><Text style={styles.tableCellBold}>Identifier</Text></View>
                    </View>
                    {inventory.length > 15 ? inventory.slice(15, 30).map((res: any, i: number) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={[styles.tableColSmall, { width: '35%' }]}><Text style={styles.tableCell}>{res.name}</Text></View>
                            <View style={[styles.tableColStatus, { width: '20%' }]}><Text style={styles.tableCell}>{res.type}</Text></View>
                            <View style={[styles.tableColLarge, { width: '45%' }]}><Text style={styles.tableCell}>{res.resource_id}</Text></View>
                        </View>
                    )) : (
                        <View style={styles.tableRow}><Text style={{ padding: 10, fontSize: 8.5 }}>All remaining resources categorized during the scan.</Text></View>
                    )}
                </View>
                <CloudFooter />
            </Page>

            {/* PAGE 13: FINDINGS P1 */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>11. Security Findings</Text>
                <SectionInfo
                    title="Vulnerability Intelligence"
                    text="Technical misconfigurations discovered that may allow unauthorized access."
                />
                {findings.slice(0, 3).map((f: any, i: number) => (
                    <View key={i} style={styles.card} wrap={false}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', color: f.severity === 'Critical' ? '#c0392b' : '#e67e22' }}>{f.type}</Text>
                            <View style={{ backgroundColor: f.severity === 'Critical' ? '#c0392b' : '#e67e22', padding: '2 8', borderRadius: 4 }}><Text style={{ color: '#fff', fontSize: 7, fontWeight: 'bold' }}>{String(f.severity).toUpperCase()}</Text></View>
                        </View>
                        <Text style={styles.textSmall}>{f.detail}</Text>
                        <View style={{ marginTop: 8, borderTopWidth: 0.5, borderTopColor: '#eee', borderTopStyle: 'solid', paddingTop: 8 }}>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1a2a6c' }}>Resolution Path:</Text>
                            <Text style={styles.textSmall}>{f.solution}</Text>
                        </View>
                    </View>
                ))}
                <CloudFooter />
            </Page>

            {/* PAGE 14: FINDINGS P2 */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h2}>12. Security Findings (Cont.)</Text>
                {findings.length > 3 ? findings.slice(3, 6).map((f: any, i: number) => (
                    <View key={i} style={styles.card} wrap={false}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#e67e22' }}>{f.type}</Text>
                            <View style={{ backgroundColor: '#e67e22', padding: '2 8', borderRadius: 4 }}><Text style={{ color: '#fff', fontSize: 7, fontWeight: 'bold' }}>{String(f.severity).toUpperCase()}</Text></View>
                        </View>
                        <Text style={styles.textSmall}>{f.detail}</Text>
                        <View style={{ marginTop: 8, borderTopWidth: 0.5, borderTopColor: '#eee', borderTopStyle: 'solid', paddingTop: 8 }}>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1a2a6c' }}>Resolution Path:</Text>
                            <Text style={styles.textSmall}>{f.solution}</Text>
                        </View>
                    </View>
                )) : (
                    <View style={styles.card}><Text style={styles.textSmall}>No additional critical or high-risk findings in this region.</Text></View>
                )}
                <CloudFooter />
            </Page>

            {/* PAGE 15: FINDINGS P3 */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h2}>13. Security Findings (Cont.)</Text>
                {findings.length > 6 ? findings.slice(6, 10).map((f: any, i: number) => (
                    <View key={i} style={styles.card} wrap={false}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#f39c12' }}>{f.type}</Text>
                            <View style={{ backgroundColor: '#f39c12', padding: '2 8', borderRadius: 4 }}><Text style={{ color: '#fff', fontSize: 7, fontWeight: 'bold' }}>{String(f.severity).toUpperCase()}</Text></View>
                        </View>
                        <Text style={styles.textSmall}>{f.detail}</Text>
                        <View style={{ marginTop: 8, borderTopWidth: 0.5, borderTopColor: '#eee', borderTopStyle: 'solid', paddingTop: 8 }}>
                            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#1a2a6c' }}>Resolution Path:</Text>
                            <Text style={styles.textSmall}>{f.solution}</Text>
                        </View>
                    </View>
                )) : (
                    <View style={styles.card}><Text style={styles.textSmall}>All secondary findings categorized and validated.</Text></View>
                )}
                <CloudFooter />
            </Page>

            {/* PAGE 16: ROADMAP */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>14. Strategic Roadmap</Text>
                <SectionInfo
                    title="Remediation Schedule"
                    text="A phased approach to achieving full security compliance."
                />
                <View style={[styles.phaseBox, { borderLeftColor: '#e74c3c' }]}>
                    <Text style={[styles.h4, { color: '#e74c3c', marginTop: 0 }]}>PHASE 1: CRITICAL CONTAINMENT (0 - 48 HRS)</Text>
                    <View style={{ marginTop: 5 }}>
                        <Text style={styles.textSmall}>• Rotate legacy Access Keys & secrets detected in scan.</Text>
                        <Text style={styles.textSmall}>• Close public ingress for management ports (22, 3389, 5432).</Text>
                        <Text style={styles.textSmall}>• Enforce Hardware MFA for all administrative root users.</Text>
                    </View>
                </View>

                <View style={[styles.phaseBox, { borderLeftColor: '#f39c12' }]}>
                    <Text style={[styles.h4, { color: '#f39c12', marginTop: 0 }]}>PHASE 2: POLICY STRENGTHENING (1 - 2 WEEKS)</Text>
                    <View style={{ marginTop: 5 }}>
                        <Text style={styles.textSmall}>• Sanitize bucket policies; enable default server-side encryption.</Text>
                        <Text style={styles.textSmall}>• Replace &apos;FullAdministratorAccess&apos; with role-based scoped policies.</Text>
                        <Text style={styles.textSmall}>• Enable VPC flow logs & CloudTrail in all active regions.</Text>
                    </View>
                </View>

                <View style={[styles.phaseBox, { borderLeftColor: '#3498db' }]}>
                    <Text style={[styles.h4, { color: '#3498db', marginTop: 0 }]}>PHASE 3: ONGOING OPS (CONTINUOUS)</Text>
                    <View style={{ marginTop: 5 }}>
                        <Text style={styles.textSmall}>• Integrate security scans into CI/CD infrastructure pipelines.</Text>
                        <Text style={styles.textSmall}>• Implement automated alerting for unauthorized resource creation.</Text>
                    </View>
                </View>
                <CloudFooter />
            </Page>

            {/* PAGE 17: BP IAM */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>15. Best Practices: IAM & MFA</Text>
                <Text style={styles.text}>
                    Strong Identity and Access Management is the first line of defense.
                </Text>
                <View style={styles.listingItem}><Text style={styles.h4}>Hardware-Based Security Units</Text></View>
                <Text style={styles.textSmall}>Transition all root and super-admin accounts to use FIDO2 hardware keys. SMS-based MFA is susceptible to intercept and SIM-swap attacks.</Text>
                <View style={styles.listingItem}><Text style={styles.h4}>Zero Trust Permissions</Text></View>
                <Text style={styles.textSmall}>Implement Just-In-Time (JIT) access for developer console sessions. Credentials should exist only for the duration of the task.</Text>
                <CloudFooter />
            </Page>

            {/* PAGE 18: BP DATA */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>16. Best Practices: Data Protection</Text>
                <Text style={styles.text}>
                    Encryption at rest and in transit is non-negotiable for enterprise cloud.
                </Text>
                <View style={styles.listingItem}><Text style={styles.h4}>Object Storage Hardening</Text></View>
                <Text style={styles.textSmall}>Default encryption (AES-256) should be enforced globally. Block-Public-Access settings should be enabled at the account level.</Text>
                <View style={styles.listingItem}><Text style={styles.h4}>Automated Disaster Recovery</Text></View>
                <Text style={styles.textSmall}>Configure cross-region backups for critical RDS and EBS datasets to protect against regional infrastructure outages.</Text>
                <CloudFooter />
            </Page>

            {/* PAGE 19: BP NETWORK */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <Text style={styles.h1}>17. Best Practices: Networking</Text>
                <Text style={styles.text}>
                    Isolate internal resources from the public internet using private subnets.
                </Text>
                <View style={styles.listingItem}><Text style={styles.h4}>Micro-Segmentation</Text></View>
                <Text style={styles.textSmall}>Each application tier (Web, App, Database) should have its own Security Group. Traffic should only flow on specific ports from authorized tiers.</Text>
                <View style={styles.listingItem}><Text style={styles.h4}>VPC Flow Log Analysis</Text></View>
                <Text style={styles.textSmall}>Enable flow logs to capture traffic telemetry. This data is essential for identifying compromised instances and diagnosing connectivity issues.</Text>
                <CloudFooter />
            </Page>

            {/* PAGE 20: CONCLUSION */}
            <Page size="A4" style={styles.page}>
                <CloudHeader />
                <View style={{ marginTop: 100, alignItems: 'center' }}>
                    <Text style={styles.h1}>18. Conclusion</Text>
                    <Text style={[styles.text, { textAlign: 'center' }]}>
                        This report distills a complex infrastructural analysis into actionable intelligence. By following the remediation roadmap, your organization will achieve a superior level of cyber resilience.
                    </Text>
                    <View style={{ width: 120, height: 2, backgroundColor: '#1a2a6c', marginVertical: 40 }} />
                    <Text style={styles.h4}>CERTIFIED SECURE BY CYBERSAFE AI</Text>
                    <Text style={styles.textSmall}>Enterprise Guarding System v2.0</Text>
                    <Text style={{ fontSize: 7, color: '#aaa', marginTop: 120 }}>End of Secure Transmission. (&copy;) 2026 CyberSafe Enterprise</Text>
                </View>
                <CloudFooter />
            </Page>

        </Document>
    );
};

export default function DefaultExport({ data }: { data?: any }) {
    return null;
}