"use client";

import AgeDistribution from "@/components/charts/AgeDistribution";
import AverageAgeByClass from "@/components/charts/AverageAgeByClass";
import CorrelationHeatmap from "@/components/charts/CorrelationHeatmap";
import OverallSurvivalDonut from "@/components/charts/OverallSurvivalDonut";
import SexDistribution from "@/components/charts/SexDistribution";
import SurvivalByClass from "@/components/charts/SurvivalByClass";
import SurvivalByClassAndGender from "@/components/charts/SurvivalByClassAndGender";
import SurvivalBySex from "@/components/charts/SurvivalBySex";
import SurvivalRateByAgeGroup from "@/components/charts/SurvivalRateByAgeGroup";
import SurvivalWithSibSp from "@/components/charts/SurvivalWithSibSp";
// CommentSection used by charts; not used for top stats
import CorrelationTable from "@/components/CorrelationTable";
import LanguageToggle from "@/components/LanguageToggle";
import SpearmanTable from "@/components/SpearmanTable";
import FeatureImportance from "@/components/charts/FeatureImportance";
import { parseTitanicCsv } from "@/lib/csv";
import type { TitanicRow } from "@/types/titanic";
import { Card, Col, message, Row, Space, Statistic, Tabs, Typography } from "@/ui";
import { InfoCircleOutlined, TeamOutlined } from "@ant-design/icons";
//
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// no upload UI; data auto-loads from public/data/titanic.csv

export default function TitanicDashboard() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<TitanicRow[]>([]);
  // keeping preview disabled since dataset loads automatically
  // const [rawPreview, setRawPreview] = useState<string>("");
  const [initialized, setInitialized] = useState<boolean>(false);
  // track loading internally to control toasts only
  const [, setLoading] = useState<boolean>(true);

  function handleCsvText(text: string) {
    try {
      const parsed = parseTitanicCsv(text);
      setRows(parsed);
      // preview disabled in auto-load mode; suppress initial load toast
      setLoading(false);
    } catch (e) {
      console.error(e);
      message.error(t('dashboard.toasts.parseFailed'));
      setLoading(false);
    }
  }

  async function loadSample() {
    try {
      const res = await fetch("/data/titanic.csv", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch sample");
      const text = await res.text();
      handleCsvText(text);
    } catch (e) {
      console.error(e);
      message.error(t('dashboard.toasts.sampleFailed'));
    }
  }

  // Auto-load project CSV on first mount if available
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    loadSample().catch(() => {
      /* ignore if missing */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  const basicStats = useMemo(() => {
    const total = rows.length;
    const survived = rows.filter((r) => r.Survived === 1).length;
    const notSurvived = rows.filter((r) => r.Survived === 0).length;
    const avgAge = (() => {
      const ages = rows.map((r) => r.Age).filter((a): a is number => typeof a === "number");
      if (ages.length === 0) return null;
      const sum = ages.reduce((s, a) => s + a, 0);
      return sum / ages.length;
    })();
    return { total, survived, notSurvived, avgAge };
  }, [rows]);

  const narrative = useMemo(() => {
    const total = rows.length || 1;
    const survived = rows.filter((r) => r.Survived === 1).length;
    const survivalRate = Math.round((survived / total) * 1000) / 10; // %

    const male = rows.filter((r) => r.Sex === "male");
    const female = rows.filter((r) => r.Sex === "female");
    const maleRate = male.length ? Math.round((male.filter((r) => r.Survived === 1).length / male.length) * 1000) / 10 : 0;
    const femaleRate = female.length ? Math.round((female.filter((r) => r.Survived === 1).length / female.length) * 1000) / 10 : 0;

    const classRate = [1, 2, 3].map((c) => {
      const cls = rows.filter((r) => r.Pclass === c);
      const rate = cls.length ? Math.round((cls.filter((r) => r.Survived === 1).length / cls.length) * 1000) / 10 : 0;
      return { c, rate };
    });

    return { survivalRate, maleRate, femaleRate, classRate };
  }, [rows]);

  // Keep currently selected tab in the URL (?tab=...) so locale switches preserve it
  const [activeTab, setActiveTab] = useState<string>("start");
  useEffect(() => {
    const key = searchParams.get("tab") || "start";
    setActiveTab(key);
  }, [searchParams]);

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={16}>
      <Card bordered>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={2} style={{ marginBottom: 0 }} className="page-main-title">
              {t('dashboard.title')}
            </Typography.Title>
          </Col>
          <Col>
            <Space>
              <LanguageToggle />
            </Space>
          </Col>
        </Row>
      </Card>
      <Card bordered>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            const params = new URLSearchParams(searchParams.toString());
            if (key === "start") {
              params.delete("tab");
            } else {
              params.set("tab", key);
            }
            const qs = params.toString();
            router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
          }}
          items={[
            {
              key: "start",
              label: t('tabs.start'),
              children: (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Typography.Title level={4}>{t('welcome.title')}</Typography.Title>
                  <Typography.Paragraph>{t('welcome.body')}</Typography.Paragraph>
                  <img src="/titanic-ship.jpg" alt="Titanic Ship" style={{ width: '100%', border: '1px solid #eee' }} />
                </Space>
              ),
            },
            {
              key: "overview",
              label: t('tabs.overview'),
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Row gutter={[16,16]}>
                      <Col xs={24} md={8}>
                        <Card bordered>
                          <Statistic title={t('dashboard.stats.total')} prefix={<TeamOutlined />} value={basicStats.total} />
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card bordered>
                          <Statistic title={t('dashboard.stats.survived')} value={basicStats.survived} prefix={<InfoCircleOutlined style={{ color: '#1677ff' }} />} valueStyle={{ color: '#1677ff' }} />
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card bordered>
                          <Statistic title={t('dashboard.stats.notSurvived')} value={basicStats.notSurvived} prefix={<InfoCircleOutlined style={{ color: '#bfbfbf' }} />} valueStyle={{ color: '#8c8c8c' }} />
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24}>
                    <OverallSurvivalDonut rows={rows} note={t('notes.start')} />
                  </Col>
                  <Col xs={24} lg={12}><SurvivalBySex rows={rows} note={t('notes.overviewSex')} /></Col>
                  <Col xs={24} lg={12}><SurvivalByClass rows={rows} note={t('notes.overviewClass')} /></Col>
                  <Col xs={24}><AgeDistribution rows={rows} note={t('notes.overviewAge')} /></Col>
                  <Col xs={24}>
                    <Card bordered>
                      <Typography.Paragraph>
                        {t('bullets.overview1', { femaleRate: narrative.femaleRate, maleRate: narrative.maleRate })}<br />
                        {t('bullets.overview2', { r1: narrative.classRate[0].rate, r2: narrative.classRate[1].rate, r3: narrative.classRate[2].rate })}
                      </Typography.Paragraph>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: "distribution",
              label: t('tabs.distribution'),
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}><SexDistribution rows={rows} note={t('notes.distributionSex')} /></Col>
                  <Col xs={24} lg={12}><AgeDistribution rows={rows} note={t('notes.distributionAge')} /></Col>
                  <Col xs={24}>
                    <Card bordered>
                      <Typography.Paragraph>
                        {t('bullets.distribution1')}<br />
                        {t('bullets.distribution2')}
                      </Typography.Paragraph>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: "survival",
              label: t('tabs.survival'),
              children: (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <SurvivalRateByAgeGroup rows={rows} note={t('notes.survivalAge')} />
                  <Card bordered>
                    <Typography.Paragraph>
                      {t('bullets.survival1')}
                    </Typography.Paragraph>
                  </Card>
                </Space>
              ),
            },
            {
              key: "correlation",
              label: t('tabs.correlation'),
              children: (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <CorrelationHeatmap rows={rows} note={t('notes.heatmap')} />
                  <CorrelationTable rows={rows} note={t('notes.pearson')} />
                  <SpearmanTable rows={rows} note={t('notes.spearman')} />
                  <FeatureImportance rows={rows} />
                  <Card bordered>
                    <Typography.Title level={5} style={{ marginTop: 0 }}>{t('explain.corTitle')}</Typography.Title>
                    <Typography.Paragraph>
                      {t('explain.corText1')}<br />
                      {t('explain.corText2')}
                    </Typography.Paragraph>
                  </Card>
                </Space>
              ),
            },
            {
              key: "insights",
              label: t('tabs.insights'),
              children: (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <AverageAgeByClass rows={rows} note={t('notes.avgAgeByClass')} />
                  <SurvivalByClassAndGender rows={rows} note={t('notes.byClassGender')} />
                  <SurvivalWithSibSp rows={rows} note={t('notes.withSibSp')} />
                  <Card bordered>
                    <Typography.Paragraph>
                      {t('bullets.insight1')}<br />
                      {t('bullets.insight2')}<br />
                      {t('bullets.insight3')}
                    </Typography.Paragraph>
                  </Card>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
}


