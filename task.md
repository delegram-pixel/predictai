# SYSTEM BUILD PROMPT
## AI-Powered No-Show & Cancellation Prediction System

---

## OBJECTIVE

Build a production-ready AI-powered appointment cancellation/no-show prediction system using Claude API that:

1. **Analyzes appointments in real-time** using Claude to reason about cancellation risk
2. **Provides explainable predictions** so users understand why a risk score was given
3. **Enables interactive analysis** via chat interface for staff questions
4. **Discovers patterns** across appointment history
5. **Recommends smart actions** based on risk level
6. **Tracks accuracy** and improves via prompt iterations (no model retraining)
7. **Works across all industries** (salon, medical, fitness, consulting, events)
8. **Deploys in 2-4 weeks** (much faster than traditional ML)

---

## SUCCESS CRITERIA

### Accuracy
- [ ] Initial accuracy: ≥70% (Week 1)
- [ ] MVP accuracy: ≥75% (Week 2)
- [ ] Production accuracy: ≥78-80% (Week 4)
- [ ] Precision: ≥65% (of predictions, % actually cancel)
- [ ] Recall: ≥60% (of actual cancellations, % we catch)

### Performance
- [ ] API latency: <3 seconds per prediction
- [ ] Batch processing: 100 appointments in <30 seconds
- [ ] Dashboard load time: <3 seconds
- [ ] System uptime: 99%+

### Features (MVP)
- [ ] Real-time prediction engine
- [ ] Interactive chat interface
- [ ] Pattern discovery
- [ ] Smart recommendations
- [ ] Performance tracking
- [ ] Dashboard with high-risk list

### User Experience
- [ ] Predictions are understandable (natural language reasoning)
- [ ] Predictions are actionable (clear recommendations)
- [ ] System is intuitive (no training needed)
- [ ] Mobile-friendly dashboard

### Launch Readiness
- [ ] All acceptance criteria met
- [ ] Documentation complete
- [ ] 3+ pilot customers validated
- [ ] Support runbooks created

---

## SYSTEM ARCHITECTURE

### High-Level Flow

```
┌─────────────────────────────────────────────────────────┐
│              APPOINTMENT CREATED                        │
│  (in customer's booking system)                         │
└────────────────┬────────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────────┐
│           OUR PREDICTION SERVICE                        │
│                                                         │
│  1. Extract appointment context:                        │
│     - Appointment details (date, time, duration)        │
│     - Service type                                      │
│     - Booking context (when booked, how)                │
│     - Client history (past cancels, no-shows)           │
│     - Client patterns (booking frequency, consistency)  │
│                                                         │
│  2. Build Claude prompt with all context                │
│                                                         │
│  3. Call Claude API                                     │
│                                                         │
│  4. Parse structured response                           │
│                                                         │
│  5. Store prediction + metadata                         │
│                                                         │
│  6. Return to dashboard                                 │
└────────────────┬────────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────────┐
│           DASHBOARD & INTERACTIONS                      │
│                                                         │
│  - Display risk scores (visual + text)                  │
│  - Show Claude's reasoning                              │
│  - Offer recommended actions                            │
│  - One-click to send SMS/email confirmations            │
│  - Chat interface for questions                         │
│  - Pattern insights                                     │
│  - Performance metrics                                  │
└────────────────┬────────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────────┐
│           ACTION EXECUTION                              │
│                                                         │
│  - Send SMS confirmations                               │
│  - Send email reminders                                 │
│  - Log outcomes (when appointment happens)              │
│  - Feed outcomes back to improve prompts                │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**Input Data Structure**:
```json
{
  "appointment_id": "APT-2025-02-15-001",
  "appointment_date": "2025-02-15T14:00:00Z",
  "appointment_duration_minutes": 30,
  "service_type": "haircut",
  "booked_date": "2025-02-14T19:30:00Z",
  "booking_channel": "web",
  "price_paid": 50,
  "is_prepaid": true,
  "client": {
    "client_id": "C001",
    "total_appointments": 12,
    "past_cancel_rate": 0.25,
    "past_noshow_rate": 0.08,
    "reschedule_count_3months": 2,
    "days_since_last_appointment": 45,
    "is_first_time": false
  },
  "context": {
    "day_of_week": "Friday",
    "time_of_day": "evening (7 PM)",
    "days_until_appointment": 1,
    "is_holiday_week": false
  }
}
```

**Output Data Structure**:
```json
{
  "appointment_id": "APT-2025-02-15-001",
  "prediction": {
    "risk_level": "MEDIUM",
    "cancellation_probability": 0.48,
    "confidence": "HIGH",
    "risk_factors": {
      "high_risk": ["Last-minute booking", "Friday evening"],
      "medium_risk": ["2 reschedules in 3 months"],
      "low_risk": ["Prepaid", "Regular customer"]
    },
    "reasoning": "Client has 25% historical cancel rate. Last-minute booking (1 day) is risky. Friday evening has higher cancel rate. However, prepayment and customer loyalty provide stability.",
    "recommendation": {
      "action": "SEND_SMS_CONFIRMATION",
      "message": "Hi [NAME], reminder: your haircut tomorrow at 7 PM. Please reply YES to confirm.",
      "timing": "24h before"
    }
  },
  "created_at": "2025-02-14T19:35:00Z",
  "model_version": "claude-sonnet-4-20250514",
  "prompt_version": "v2.1"
}
```

---

## CORE FEATURES TO BUILD

### Feature 1: Real-Time Prediction Engine

**Description**: Call Claude API to analyze each appointment

**Technical Requirements**:
- [ ] API endpoint: `POST /api/v1/predict`
- [ ] Input: Structured appointment JSON
- [ ] Output: Risk assessment + reasoning + recommendation
- [ ] Latency: <3 seconds
- [ ] Caching: Cache results for 24 hours (reduce API calls)
- [ ] Error handling: Graceful fallback if Claude unavailable
- [ ] Rate limiting: Handle concurrent requests

**Prompt Template**:
```
You are an expert {INDUSTRY} appointment cancellation analyst.

CLIENT PROFILE:
- Past cancellation rate: {CANCEL_RATE}%
- Past no-show rate: {NOSHOW_RATE}%
- Total appointments: {TOTAL_APTS}
- Reschedules (3 months): {RESCHEDULE_COUNT}
- Days since last appointment: {DAYS_SINCE_LAST}
- First time customer: {IS_FIRST_TIME}

THIS APPOINTMENT:
- Service: {SERVICE_TYPE}
- Booked: {DAYS_IN_ADVANCE} days in advance
- Appointment date/time: {DATE_TIME}
- Duration: {DURATION} minutes
- Price: ${PRICE}
- Prepaid: {IS_PREPAID}
- Day of week: {DAY_OF_WEEK}
- Time of day: {TIME_OF_DAY}

INDUSTRY CONTEXT:
{INDUSTRY_BENCHMARKS}

ANALYSIS FRAMEWORK:
1. Client reliability (based on history)
2. Booking context (lead time, payment, channel)
3. Temporal factors (day, time, season)
4. Service commitment (type, price, duration)

PROVIDE JSON OUTPUT:
{
  "risk_level": "LOW|MEDIUM|HIGH",
  "cancellation_probability": 0-100 (as decimal),
  "confidence": "LOW|MEDIUM|HIGH",
  "risk_factors": {
    "high_risk": [...],
    "medium_risk": [...],
    "low_risk": [...]
  },
  "reasoning": "...",
  "recommendation": {
    "action": "SEND_SMS_CONFIRMATION|REQUIRE_CONFIRMATION|REQUIRE_PREPAYMENT|SEND_PERSONAL_CALL|NO_ACTION",
    "details": "..."
  }
}
```

**Acceptance Criteria**:
- [ ] Returns valid JSON with all required fields
- [ ] Risk probability is 0-100 range
- [ ] Reasoning is clear and understandable
- [ ] Recommendation is actionable
- [ ] Handles missing data gracefully
- [ ] Works for new clients (no history)
- [ ] Latency <3 seconds 95% of the time

---

### Feature 2: Interactive Chat Interface

**Description**: Staff can ask Claude questions about appointments

**Examples**:
- "What's the risk for Friday 7 PM haircut?"
- "What if I reschedule this to next week?"
- "Which 5 appointments are riskiest today?"
- "What's the pattern with client C001?"
- "Should I offer a discount to reduce cancellation risk?"

**Technical Requirements**:
- [ ] API endpoint: `POST /api/v1/chat`
- [ ] Input: User message + appointment context
- [ ] Output: Claude's conversational response
- [ ] Maintain conversation context (multi-turn)
- [ ] Keep responses concise (<300 words)
- [ ] Return structured data (risk assessment + conversation)

**Implementation**:
```python
@app.post("/api/v1/chat")
async def chat(message: str, appointment_id: str = None):
    """
    Chat with Claude about appointments.
    
    Example:
    - message: "What's the risk for this Friday 7 PM appointment?"
    - appointment_id: "APT-123"
    
    Returns:
    - reply: Conversational response from Claude
    - insights: Structured data (risk, factors, recommendations)
    """
```

**Acceptance Criteria**:
- [ ] Answers appointment-related questions
- [ ] Explains predictions and reasoning
- [ ] Suggests optimizations
- [ ] Stays in context (talks about appointments)
- [ ] Handles follow-up questions

---

### Feature 3: Pattern Discovery

**Description**: Claude analyzes historical data to identify patterns

**Pattern Types**:
- Client patterns: "This client always cancels on Mondays"
- Time patterns: "Friday evenings have 35% cancel rate"
- Service patterns: "Hair color has lower cancel rate than cuts"
- External patterns: "Weather/holidays affect cancellations"

**Technical Requirements**:
- [ ] API endpoint: `GET /api/v1/patterns?industry=salon&type=client`
- [ ] Inputs: Industry, pattern type, optional filters
- [ ] Output: List of discovered patterns + recommendations
- [ ] Query all historical data on demand
- [ ] Summarize findings in natural language

**Acceptance Criteria**:
- [ ] Identifies actionable patterns
- [ ] Returns insights within 10 seconds
- [ ] Patterns are accurate (testable against data)
- [ ] Recommendations are specific

---

### Feature 4: Smart Recommendations

**Description**: Suggest actions based on risk level

**Decision Rules**:
```
IF risk < 30%:
  → No action needed
  
ELIF 30% < risk < 60%:
  → SEND_SMS_CONFIRMATION (24h before)
  
ELIF 60% < risk < 80%:
  → SEND_SMS_CONFIRMATION + REQUIRE_TEXT_RESPONSE
  → OR REQUIRE_PREPAYMENT (if not already paid)
  
ELIF risk > 80%:
  → REQUIRE_CONFIRMATION + PREPAYMENT
  → OR OFFER_INCENTIVE (discount / reschedule incentive)
  → OR PERSONAL_CALL (48h before)
```

**Technical Requirements**:
- [ ] Rule engine that maps risk → action
- [ ] Customizable rules per industry
- [ ] Override capability (staff can force different action)
- [ ] A/B testing framework for testing different rules
- [ ] Track which actions reduce cancellations

**Acceptance Criteria**:
- [ ] Actions are specific and executable
- [ ] Staff can implement recommendations with 1 click
- [ ] Rules adapt based on industry
- [ ] Impact is measurable

---

### Feature 5: Performance Tracking & Feedback Loop

**Description**: Monitor accuracy and improve via prompt iteration

**Metrics to Track**:
- Accuracy: % of predictions correct
- Precision: Of predicted cancellations, % actually cancel
- Recall: Of actual cancellations, % we predict
- Confidence: How sure Claude is

**Feedback Loop**:
```
Prediction made → Appointment occurs → Outcome recorded
→ Compare prediction vs reality → Analyze mismatches
→ Refine prompt → Next prediction is more accurate
```

**Technical Requirements**:
- [ ] Store all predictions with metadata
- [ ] Record actual appointment outcomes
- [ ] Calculate accuracy metrics daily
- [ ] Alert if accuracy drops >5%
- [ ] Dashboard showing metrics over time
- [ ] Interface to test prompt updates on historical data

**Acceptance Criteria**:
- [ ] Metrics calculated automatically
- [ ] Weekly accuracy reports
- [ ] Clear visibility into where model struggles
- [ ] Easy feedback mechanism for staff

---

### Feature 6: Dashboard

**Description**: Visual interface showing predictions and actions

**Dashboard Views**:

**View 1: High-Risk Today**
- List of today's appointments sorted by risk
- Color-coded (red/yellow/green)
- Show: Client name, time, risk score, confidence
- One-click action buttons (Send SMS, Call, etc.)
- Show Claude's reasoning

**View 2: Full Week/Month**
- Calendar view of all appointments
- Risk indicators per slot
- Hover to see details
- Filter by risk level, service type, location

**View 3: Metrics & Trends**
- Overall cancellation rate (current vs. historical)
- Accuracy metrics (precision, recall, F1)
- Top cancellation drivers
- Charts showing trends

**View 4: Pattern Insights**
- Discovered patterns (text-based)
- Recommended actions
- Historical data supporting patterns

**Mobile View** (for staff at front desk):
- Simplified list of today's appointments
- Risk indicator (color)
- Status (confirmed/pending/high-risk)
- Quick action buttons (SMS, Call, Confirm)

**Technical Requirements**:
- [ ] Built with React + TypeScript
- [ ] Real-time updates (new appointments appear instantly)
- [ ] Responsive design (works on desktop, tablet, mobile)
- [ ] Dark mode support (optional)
- [ ] Fast loading (<3 seconds)

**Acceptance Criteria**:
- [ ] Shows all high-risk appointments
- [ ] Claude's reasoning visible
- [ ] One-click to take recommended action
- [ ] Mobile usable by reception staff
- [ ] Professional appearance

---

## TECHNICAL STACK

### Backend
- **Framework**: neon, prisma
- **Database**: PostgreSQL (appointments, predictions, outcomes)
- **Cache**: Redis (cache predictions for 24h, reduce API calls)
- **Queue**: Celery + RabbitMQ (async SMS/email jobs)
- **Deployment**:vercel

### Frontend
- **Framework**: nextjs + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query / Redux
- **UI Components**: Shadcn/ui
- **Mobile**: React Native (stretch goal)

### External Services
- **Claude API**: Anthropic Claude API
- **SMS**: Twilio (send confirmations, track delivery)
- **Email**: SendGrid (send reminders, track opens)
- **Analytics**: PostHog / Mixpanel (track usage)
- **Monitoring**: DataDog / Sentry (errors, performance)

### Infrastructure
<!-- - **Compute**: AWS Lambda / Google Cloud Run (serverless) -->
- **Storage**: S3 (backups, model versions, logs)
- **Database**: PostgreSQL (RDS or equivalent)
- **Cache**: Redis (ElastiCache or equivalent)
- **CDN**: CloudFront (serve static assets)

---

## API SPECIFICATION

### 1. Predict Single Appointment
```
POST /api/v1/predict

Request:
{
  "appointment_id": "APT-123",
  "appointment_date": "2025-02-15T14:00:00Z",
  "booked_date": "2025-02-14T19:30:00Z",
  "service_type": "haircut",
  "duration_minutes": 30,
  "price": 50,
  "is_prepaid": true,
  "booking_channel": "web",
  "client": {
    "client_id": "C001",
    "total_appointments": 12,
    "cancel_rate": 0.25,
    "noshow_rate": 0.08,
    "reschedule_count_3months": 2,
    "days_since_last": 45,
    "is_first_time": false
  }
}

Response (200):
{
  "appointment_id": "APT-123",
  "risk_level": "MEDIUM",
  "cancellation_probability": 0.48,
  "confidence": "HIGH",
  "reasoning": "Client has 25% historical cancel rate. Last-minute booking (1 day) increases risk. Friday evening also higher risk. But prepaid and loyal customer reduce risk.",
  "risk_factors": {
    "high_risk": ["Last-minute booking", "Friday evening"],
    "medium_risk": [],
    "low_risk": ["Prepaid", "Returning customer"]
  },
  "recommendation": {
    "action": "SEND_SMS_CONFIRMATION",
    "message": "Hi [NAME], reminder: your haircut tomorrow at 7 PM. Reply YES to confirm.",
    "timing": "24h before"
  },
  "created_at": "2025-02-14T19:35:00Z",
  "model_version": "claude-sonnet-4"
}

Error (500):
{
  "error": "Claude API unavailable, using cached prediction",
  "cached_prediction": {...}
}
```

### 2. Batch Predict
```
POST /api/v1/predict-batch

Request:
{
  "appointments": [
    {...appointment1...},
    {...appointment2...},
    ...
  ]
}

Response (200):
[
  {prediction1},
  {prediction2},
  ...
]
```

### 3. Chat
```
POST /api/v1/chat

Request:
{
  "message": "What's the risk for this Friday 7 PM appointment?",
  "appointment_id": "APT-123",
  "context": "conversation_id: ABC123"
}

Response (200):
{
  "reply": "MEDIUM-HIGH (62%). This client booked last-minute (1 day), it's Friday evening (higher cancel rate), but they paid in advance which reduces risk. I'd recommend sending SMS confirmation 24h before.",
  "prediction": {
    "risk_level": "MEDIUM_HIGH",
    "probability": 0.62
  },
  "suggested_actions": [
    "SEND_SMS_CONFIRMATION",
    "TRACK_ENGAGEMENT"
  ]
}
```

### 4. Patterns
```
GET /api/v1/patterns?industry=salon&type=client&limit=10

Response (200):
{
  "patterns": [
    {
      "type": "client",
      "client_id": "C001",
      "pattern": "Cancels 40% of Friday appointments, only 5% of Tuesday",
      "confidence": 0.85,
      "data_points": 20,
      "recommendation": "Steer toward Tuesday bookings"
    },
    {
      "type": "time",
      "pattern": "Friday evenings have 35% cancel rate vs 15% Wednesday mornings",
      "confidence": 0.92,
      "data_points": 500,
      "recommendation": "Overbook Friday evenings by 20%"
    }
  ]
}
```

### 5. Metrics
```
GET /api/v1/metrics?industry=salon&date_range=30days

Response (200):
{
  "period": "last_30_days",
  "total_predictions": 1250,
  "accuracy": 0.78,
  "precision": 0.72,
  "recall": 0.75,
  "f1_score": 0.73,
  "roc_auc": 0.82,
  "confidence_distribution": {
    "high": 0.65,
    "medium": 0.25,
    "low": 0.10
  },
  "risk_distribution": {
    "low": 0.40,
    "medium": 0.35,
    "high": 0.25
  },
  "trend": {
    "accuracy_improvement": "+3%",
    "best_performing_prompt": "v2.3"
  }
}
```

### 6. Actions
```
POST /api/v1/actions/send-sms

Request:
{
  "appointment_id": "APT-123",
  "message": "Hi John, reminder: your haircut tomorrow at 7 PM. Reply YES to confirm.",
  "send_time": "2025-02-14T19:00:00Z"
}

Response (200):
{
  "action_id": "ACT-456",
  "appointment_id": "APT-123",
  "type": "SMS_CONFIRMATION",
  "status": "sent",
  "message_id": "MSG-789",
  "delivery_status": "delivered",
  "sent_at": "2025-02-14T19:00:00Z"
}
```

---

## DATABASE SCHEMA

### appointments table
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  client_id VARCHAR(255),
  appointment_date TIMESTAMP,
  booked_date TIMESTAMP,
  service_type VARCHAR(255),
  duration_minutes INT,
  price DECIMAL,
  is_prepaid BOOLEAN,
  booking_channel VARCHAR(50),
  status VARCHAR(50), -- completed, cancelled, no_show, pending
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### clients table
```sql
CREATE TABLE clients (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  total_appointments INT,
  cancel_count INT,
  noshow_count INT,
  last_appointment_date TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### predictions table
```sql
CREATE TABLE predictions (
  id UUID PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id),
  risk_level VARCHAR(50), -- LOW, MEDIUM, HIGH
  cancellation_probability DECIMAL,
  confidence VARCHAR(50),
  reasoning TEXT,
  recommendation_action VARCHAR(100),
  recommendation_details TEXT,
  model_version VARCHAR(50),
  prompt_version VARCHAR(50),
  created_at TIMESTAMP,
  
  -- For feedback loop
  actual_outcome VARCHAR(50), -- completed, cancelled, no_show
  outcome_recorded_at TIMESTAMP,
  prediction_correct BOOLEAN
);
```

### actions table
```sql
CREATE TABLE actions (
  id UUID PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id),
  action_type VARCHAR(100), -- SMS_CONFIRMATION, EMAIL_REMINDER, etc
  status VARCHAR(50), -- sent, delivered, clicked, failed
  message_content TEXT,
  scheduled_time TIMESTAMP,
  executed_time TIMESTAMP,
  result JSONB,
  created_at TIMESTAMP
);
```

---

## IMPLEMENTATION TIMELINE

### Week 1: Foundation Setup

**Day 1-2: Infrastructure & API Setup**
- [ ] Set up GitHub repo
- [ ] Create FastAPI project structure
- [ ] Set up PostgreSQL database
- [ ] Set up Redis cache
- [ ] Get Anthropic API key + test connection
- [ ] Create Docker setup

**Day 3-4: Core Prediction Endpoint**
- [ ] Build `/api/v1/predict` endpoint
- [ ] Implement Claude API integration
- [ ] Create base prompt template
- [ ] Build response parsing
- [ ] Add error handling + fallbacks
- [ ] Test with 50 sample appointments

**Day 5: Testing & Optimization**
- [ ] Latency testing (target <3 sec)
- [ ] Response validation
- [ ] Caching implementation
- [ ] Documentation

**Deliverable**: Working prediction engine, 70% accuracy on test data

---

### Week 2: Features & Frontend

**Day 1-2: Dashboard Frontend**
- [ ] Set up React project + TypeScript
- [ ] Design dashboard UI (Figma or Storybook)
- [ ] Build high-risk appointments list
- [ ] Build metrics dashboard
- [ ] Implement responsive design

**Day 3-4: Chat Interface & Patterns**
- [ ] Build chat component (frontend)
- [ ] Implement `/api/v1/chat` endpoint
- [ ] Implement `/api/v1/patterns` endpoint
- [ ] Add real-time updates (WebSocket)
- [ ] Test Claude conversation quality

**Day 5: Integration & Polish**
- [ ] Connect frontend to backend APIs
- [ ] Test end-to-end flows
- [ ] Optimize performance
- [ ] Fix bugs from integration testing

**Deliverable**: Complete dashboard + chat + pattern discovery, 75% accuracy

---

### Week 3: Actions & Feedback Loop

**Day 1-2: SMS/Email Integration**
- [ ] Integrate with Twilio (SMS)
- [ ] Integrate with SendGrid (email)
- [ ] Build action queue (Celery)
- [ ] Implement `/api/v1/actions` endpoints
- [ ] Test SMS/email delivery

**Day 3-4: Feedback Loop & Metrics**
- [ ] Build outcome tracking system
- [ ] Implement accuracy calculation
- [ ] Create metrics endpoints
- [ ] Build metrics dashboard
- [ ] Set up daily accuracy reporting

**Day 5: Prompt Refinement (v2)**
- [ ] Analyze first week of predictions
- [ ] Identify wrong predictions
- [ ] Update prompt based on failures
- [ ] Test refined prompt
- [ ] Deploy v2 prompt

**Deliverable**: Live SMS/email confirmations, feedback loop working, 78% accuracy

---

### Week 4: Optimization & Launch

**Day 1-2: Performance & Scale**
- [ ] Load testing (1000 predictions/min)
- [ ] Optimize database queries
- [ ] Optimize cache strategy
- [ ] Monitor API latency
- [ ] Set up monitoring/alerting

**Day 3-4: QA & Documentation**
- [ ] Comprehensive testing
- [ ] Security review
- [ ] Documentation (API docs, user guide, admin guide)
- [ ] Staff training materials

**Day 5: Beta Launch Prep**
- [ ] Final prompt optimization (v3/v4)
- [ ] Beta customer onboarding
- [ ] Support runbooks
- [ ] Go/no-go decision

**Deliverable**: Production-ready system, 80%+ accuracy, ready for customers

---

## WEEK-BY-WEEK SUCCESS METRICS

### Week 1
- [ ] Prediction endpoint working
- [ ] Response time <3 seconds
- [ ] Accuracy ≥70%
- [ ] Can call Claude API reliably

### Week 2
- [ ] Dashboard UI complete
- [ ] Chat interface working
- [ ] Pattern discovery working
- [ ] Accuracy ≥75%
- [ ] Staff feedback gathered

### Week 3
- [ ] SMS/email confirmations working
- [ ] Feedback loop integrated
- [ ] Accuracy metrics calculated
- [ ] Accuracy ≥78%
- [ ] v2 prompt deployed

### Week 4
- [ ] Load testing passed
- [ ] Monitoring/alerting working
- [ ] Documentation complete
- [ ] Accuracy ≥80%
- [ ] Ready for production customers

---

## INDUSTRY-SPECIFIC CUSTOMIZATION

### Salon/Spa Prompt
- Emphasize service type (color higher commitment than haircut)
- Emphasize stylist consistency
- Include product/package information
- Consider walk-in vs. appointment culture

### Medical Practice Prompt
- Emphasize appointment urgency (emergency vs. routine)
- Focus on no-show rate (not cancellation)
- Consider appointment type (follow-up more reliable than initial)
- Respect HIPAA (don't reference diagnosis)

### Fitness Studio Prompt
- Flag trial members (50%+ no-show rate)
- Consider class type (personal training vs. group)
- Emphasize commitment (package members vs. drop-ins)
- Consider time of day (morning more reliable than evening)

### Consulting Practice Prompt
- Emphasize client value/importance
- Consider meeting type (discovery vs. scoped project)
- Emphasize preparation time cost
- Consider recurring vs. one-off

### Events/Ticketing Prompt
- Emphasize ticket price (free vs. paid)
- Consider group size (groups attend, individuals less reliable)
- Emphasize FOMO (popular events have higher attendance)
- Consider refund policies

---

## PROMPT EVOLUTION STRATEGY

**Week 1 - v1 (Basic)**
```
Simple prompt with core factors only
- Client history
- Booking lead time
- Day of week
→ 70% accuracy
```

**Week 2 - v2 (Industry-Specific)**
```
Add industry context
- Service type benchmarks
- Industry-specific patterns
- Common cancellation reasons
→ 75% accuracy
```

**Week 3 - v3 (Pattern-Enhanced)**
```
Add reasoning framework
- Weighing multiple factors
- Explaining trade-offs
- Considering edge cases
→ 78% accuracy
```

**Week 4 - v4 (Optimized)**
```
Final refinement based on feedback
- Fixing common misclassifications
- Adding nuanced rules
- Improving confidence scores
→ 80%+ accuracy
```

---

## TESTING STRATEGY

### Unit Tests
- [ ] Prompt generation
- [ ] Claude response parsing
- [ ] Database queries
- [ ] API endpoints

### Integration Tests
- [ ] Claude API integration
- [ ] SMS/email delivery
- [ ] Database transaction integrity
- [ ] Cache invalidation

### End-to-End Tests
- [ ] Complete prediction flow
- [ ] Chat conversations
- [ ] Action execution
- [ ] Feedback loop

### Load Tests
- [ ] 1,000 concurrent requests
- [ ] 100 batch predictions
- [ ] Database query performance
- [ ] API latency under load

### Accuracy Tests
- [ ] Predictions vs. actual outcomes
- [ ] Precision/recall/F1 calculation
- [ ] Comparison across industries
- [ ] Trending over time

---

## DEPLOYMENT CHECKLIST

Before launch to production:
- [ ] All acceptance criteria met
- [ ] Security review passed
- [ ] HIPAA review passed (if medical)
- [ ] Load testing successful
- [ ] Monitoring/alerting configured
- [ ] Documentation complete
- [ ] Staff trained
- [ ] Support runbooks ready
- [ ] 3+ pilot customers validated
- [ ] Backup/disaster recovery tested

---

## RISK MITIGATION

### Risk: Claude API latency
- **Mitigation**: Cache predictions for 24 hours, use async batch processing

### Risk: Claude API goes down
- **Mitigation**: Fallback to cached predictions or simple rules

### Risk: Low accuracy
- **Mitigation**: Iterate on prompts weekly, compare to simple baseline

### Risk: Users don't trust predictions
- **Mitigation**: Show confidence levels, display reasoning, recommend human review for high-value clients

### Risk: SMS/email delivery fails
- **Mitigation**: Implement retry logic, fallback to alternative channels

### Risk: Data privacy issues
- **Mitigation**: Encrypt sensitive data, implement HIPAA compliance, audit logging

---

## SAMPLE USAGE FLOWS

### Flow 1: New Appointment Created
```
1. Customer books appointment in salon system
2. Our system receives webhook: "new appointment"
3. Extract appointment context
4. Call Claude API
5. Store prediction in database
6. Dashboard updates: new appointment appears with risk score
7. Staff sees high-risk appointment
8. Staff clicks "Send SMS Confirmation"
9. System sends SMS to customer
10. Customer replies "YES"
11. System updates prediction: lower risk (confirmed by customer)
12. Appointment day arrives
13. Customer shows up
14. Staff marks "completed"
15. System records prediction accuracy
```

### Flow 2: Staff Asks Question
```
1. Staff member opens chat interface
2. Types: "What's the risk for Friday 7 PM haircut?"
3. System sends message + appointment context to Claude
4. Claude analyzes and responds conversationally
5. Staff reads explanation and recommendations
6. Staff decides to send SMS confirmation
7. Staff clicks button or types "send sms"
8. System sends SMS immediately
9. Chat shows confirmation sent
```

### Flow 3: Pattern Discovery
```
1. Manager clicks "View Patterns" on dashboard
2. System queries all historical data
3. Claude analyzes 500+ appointments
4. Claude identifies key patterns
5. Dashboard displays patterns with insights:
   - "Client C001: 40% cancel on Fridays, 5% on Tuesdays"
   - "Friday evenings: 35% cancel rate vs 15% Wednesday mornings"
   - "Hair color: 8% cancel vs haircuts: 22% cancel"
6. Manager reads recommendations
7. Manager adjusts booking strategy based on patterns
```

---

## SUCCESS DEFINITION

### MVP (Week 4) ✅
- ✅ Predictions working for all 5 industries
- ✅ Accuracy ≥80%
- ✅ Dashboard functional
- ✅ Chat interface working
- ✅ SMS confirmations sending
- ✅ 3+ pilot customers active
- ✅ Documentation complete
- ✅ Ready for production launch

### Phase 2 (Month 2-3) 🎯
- Accuracy ≥82-85%
- 50+ customers
- $X revenue/month
- NPS ≥50
- Integration with 3+ booking systems

### Phase 3 (Month 4-6) 🚀
- Accuracy ≥85%+
- 200+ customers
- Hybrid ML layer added (optional)
- Industry-specific customizations
- Enterprise features

---

## GO-LIVE CHECKLIST

**7 Days Before**:
- [ ] Final testing complete
- [ ] All staff trained
- [ ] Support team ready
- [ ] Monitoring/alerting configured
- [ ] Backup plans in place

**Day Before**:
- [ ] Final security review
- [ ] Database backups
- [ ] Customer communication sent
- [ ] On-call rotation scheduled

**Launch Day**:
- [ ] Go/no-go decision
- [ ] Monitor error rates closely
- [ ] Be ready to rollback
- [ ] Customer support available
- [ ] Celebrate! 🎉

---

## BUILD NEXT STEPS

1. **Review this prompt** with engineering team
2. **Create tech design** for each component
3. **Set up development environment** (GitHub, Docker, databases)
4. **Start Week 1** - Foundation setup
5. **Daily standups** to track progress
6. **Weekly demos** to stakeholders
7. **Iterate based on feedback**

---

## QUESTIONS TO RESOLVE

Before starting: Get clarity on these from Product/Operations:

1. **Data Format**: How will appointment data be provided? (API, CSV, database sync?)
2. **SMS Service**: Should we use Twilio, or integrate with existing provider?
3. **Industries**: Start with all 5, or prioritize specific ones?
4. **Pilot Customers**: Who are the 3-5 beta customers?
5. **Integration**: How do we connect to customer's booking system? (Webhook API? Manual sync?)
6. **Support**: Who will support customers during beta?
7. **Pricing**: How will customers be charged? (Monthly? Per-prediction? Freemium?)

---

## BUILD STATUS

**Ready to build**: ✅ YES

**All requirements specified**: ✅ YES

**APIs designed**: ✅ YES

**Database schema**: ✅ YES


**Success criteria**: ✅ Clear

**Next step**: Start Week 1 implementation

---

**🚀 Let's build! Assign tasks and start development immediately.**