import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { FiAward, FiActivity } from 'react-icons/fi';

const ResultPage = () => {
    // Simulated participant results
    const myResults = [
        { event: "Hackathon 2026", rank: 1, prize: "$1000", status: "Winner" },
        { event: "Robo Wars", rank: 4, prize: "-", status: "Participation" }
    ];

    return (
        <div className="py-4">
            <div className="text-center mb-5">
                <div className="d-inline-block p-4 rounded-circle bg-soft-gold mb-3">
                    <FiAward size={50} className="text-gold-accent" />
                </div>
                <h2 className="fw-bold text-gradient display-6">My Performance</h2>
                <p className="text-muted fw-medium">Tracking your achievements across all events</p>
            </div>

            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    {myResults.map((result, idx) => (
                        <Card key={idx} className="glass-card mb-4 border-0 text-start shadow-sm overflow-hidden">
                            <div className="d-flex align-items-center p-4">
                                <div className={`p-3 rounded-circle me-4 ${result.rank <= 3 ? 'bg-soft-gold' : 'bg-light'}`}>
                                    {result.rank <= 3 ? <FiAward className="text-gold-accent" size={28} /> : <FiActivity className="text-muted" size={28} />}
                                </div>
                                <div className="flex-grow-1">
                                    <h4 className="fw-bold text-dark mb-1">{result.event}</h4>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className={`badge rounded-pill px-3 py-2 ${result.rank <= 3 ? 'bg-soft-gold text-gold-accent' : 'bg-light text-muted'}`}>{result.status}</span>
                                        {result.prize !== '-' && <span className="text-gold-accent fw-bold small">{result.prize}</span>}
                                    </div>
                                </div>
                                <div className="text-end">
                                    <h1 className="fw-bold text-dark mb-0">#{result.rank}</h1>
                                    <small className="text-muted fw-bold text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Rank</small>
                                </div>
                            </div>
                            <div style={{ height: '3px', width: '100%', background: result.rank <= 3 ? 'var(--gold-accent)' : '#eee' }}></div>
                        </Card>
                    ))}

                    <Alert variant="light" className="glass-panel border-0 text-muted mt-5 text-center py-4">
                        <FiActivity className="mb-2" size={24} /><br />
                        <small className="fw-medium">Participate in more events to build your champion history! Good luck.</small>
                    </Alert>
                </Col>
            </Row>
        </div>
    );
};

export default ResultPage;
