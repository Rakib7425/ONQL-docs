import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

const heroQuery = `shop.orders[status = "paid"]{
  id, total, placed_at,
  customer{name, email},
  items{product{name}, qty, price}
}`;

const features = [
  {
    title: 'Shape-first queries',
    body: 'Ask for the JSON you want. The query and the response share the same shape — no serializers, no mappers.',
  },
  {
    title: 'Context-aware',
    body: 'Same query, different rows per caller. Row-level authorization lives in the protocol file, not in your backend code.',
  },
  {
    title: 'Zero glue code',
    body: 'One protocol file replaces an entire BFF / API layer. Declarative JSON migrations — no CREATE TABLE, no ALTER.',
  },
  {
    title: 'Embedded + fast',
    body: 'Built on BadgerDB. Reverse indexes on every column, RAM buffering, single binary. Single-digit-ms queries.',
  },
  {
    title: 'Any language',
    body: 'Go, Python, Node, Java, C#, PHP, Ruby, Rust, C, C++ drivers. The wire format is a single-line JSON message, so rolling your own takes an hour.',
  },
  {
    title: 'Open source',
    body: 'Apache 2.0. No vendor, no seats, no pricing page. Run it on a VPS, a laptop, or a Raspberry Pi.',
  },
];

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.hero)}>
      <div className="container">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>ONQL · v1</p>
            <h1 className={styles.heroTitle}>
              Describe your data.<br />
              <span className={styles.accent}>Skip the API.</span>
            </h1>
            <p className={styles.heroTagline}>{siteConfig.tagline}</p>
            <div className={styles.ctaRow}>
              <Link className={clsx('button button--primary button--lg', styles.ctaPrimary)} to="/getting-started/installation">
                Get started
              </Link>
              <Link className={clsx('button button--secondary button--lg', styles.ctaSecondary)} to="/tour/basics">
                Take the tour
              </Link>
              <Link className={styles.ctaGhost} to="/drivers">
                Drivers →
              </Link>
            </div>
          </div>
          <div className={styles.heroCode}>
            <CodeBlock language="text" className={styles.codeBlock}>{heroQuery}</CodeBlock>
            <p className={styles.codeCaption}>
              One query = a SELECT, four JOINs, an auth rule, and a JSON serializer.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DataFlow() {
  return (
    <section className={styles.flow}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Query in. JSON out. Same shape.</h2>
        <div className={styles.flowGrid}>
          <div>
            <p className={styles.flowLabel}>You send</p>
            <CodeBlock language="text">{`users{id, name, orders{total}}`}</CodeBlock>
          </div>
          <div className={styles.flowArrow}>→</div>
          <div>
            <p className={styles.flowLabel}>You get</p>
            <CodeBlock language="json">{`{
  "users": [
    { "id": 1, "name": "Ada",
      "orders": [{ "total": 99 }] }
  ]
}`}</CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function NextSteps() {
  const items = [
    { title: 'Installation', href: '/getting-started/installation', body: 'Pull the binary, start the server, open the shell.' },
    { title: '5-minute tour', href: '/tour/basics', body: 'Queries, filters, joins, aggregates — one page each.' },
    { title: 'Cheat sheet', href: '/reference/cheatsheet', body: 'Every operator and function on one page.' },
    { title: 'Cookbook', href: '/cookbook/dashboards', body: 'Production-style queries for real workloads.' },
  ];
  return (
    <section className={styles.next}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Where to next</h2>
        <div className={styles.nextGrid}>
          {items.map((i) => (
            <Link key={i.href} to={i.href} className={styles.nextCard}>
              <h3>{i.title} <span className={styles.nextArrow}>→</span></h3>
              <p>{i.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title} — ${siteConfig.tagline}`} description={siteConfig.tagline}>
      <Hero />
      <main>
        <Features />
        <DataFlow />
        <NextSteps />
      </main>
    </Layout>
  );
}
