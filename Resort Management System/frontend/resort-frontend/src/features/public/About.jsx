import React from "react";
import { Container, Box, Typography, Grid, Card, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { CheckCircle } from "@mui/icons-material";

export default function About() {
  return (
    <Box sx={{ bgcolor: "#f8fafc", py: 10, px: 2, position: "relative", overflow: "hidden" }}>
      {/* ================= DECORATIVE SHAPES ================= */}
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          bgcolor: "primary.light",
          borderRadius: "50%",
          top: -50,
          left: -50,
          opacity: 0.2,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          bgcolor: "secondary.light",
          borderRadius: "50%",
          bottom: -50,
          right: -50,
          opacity: 0.2,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" mb={10}>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              About Our Company
            </Typography>
            <Typography variant="h6" color="text.secondary" mt={2}>
              Building smart, reliable, and scalable resort management solutions
              for the modern hospitality industry.
            </Typography>
          </Box>
        </motion.div>

        {/* ================= STORY ================= */}
        <Section>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" mb={2}>
              🏨 Our Story
            </Typography>
            <Typography paragraph>
              Our Resort Management System was built with a clear purpose — to simplify how resorts, hotels, and hospitality businesses manage bookings, rooms, services, food orders, and payments in one unified platform.
            </Typography>
            <Typography paragraph>
              Many resorts still rely on fragmented tools, manual coordination, or outdated software. This leads to operational inefficiencies, revenue loss, and poor guest experience. We set out to change that.
            </Typography>
          </motion.div>
        </Section>

        {/* ================= MISSION & VISION ================= */}
        <SectionAlt>
          <Grid container spacing={6}>
            {[
              {
                title: "🎯 Our Mission",
                text: "To empower resorts and hotels with a secure, intelligent, and easy-to-use management platform that improves operational efficiency and guest satisfaction.",
              },
              {
                title: "🚀 Our Vision",
                text: "To become a trusted digital backbone for hospitality businesses, enabling smart decision-making, automation, and sustainable growth.",
              },
            ].map((item, i) => (
              <Grid item xs={12} md={6} key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Typography variant="h4" mb={2}>
                    {item.title}
                  </Typography>
                  <Typography>{item.text}</Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </SectionAlt>

        {/* ================= WHAT WE OFFER ================= */}
        <Section>
          <Typography variant="h4" mb={3}>
            🧩 What Our Platform Offers
          </Typography>
          <Stack spacing={1} pl={2}>
            {[
              "End-to-end booking lifecycle management",
              "Real-time room availability and pricing control",
              "Integrated food ordering & billing system",
              "Secure payments with invoice generation",
              "Admin, owner, and user role-based dashboards",
              "Analytics, reports, and future AI recommendations",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Typography>
                  <CheckCircle sx={{ fontSize: 18, color: "green", mr: 1 }} />
                  {item}
                </Typography>
              </motion.div>
            ))}
          </Stack>
        </Section>

        {/* ================= WHY US ================= */}
        <SectionAlt>
          <Typography variant="h4" mb={4}>
            💡 Why Choose Our System?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Production-Grade Design",
                text: "Built using layered architecture, secure APIs, and scalable backend principles.",
              },
              {
                title: "Real-World Business Logic",
                text: "Strict booking, payment, and food-ordering rules designed for actual resort operations.",
              },
              { title: "Security First", text: "JWT-based authentication with role-based authorization." },
              {
                title: "Future Ready",
                text: "Designed to support analytics, AI recommendations, and dynamic pricing.",
              },
            ].map((card, i) => (
              <Grid item xs={12} md={6} key={card.title}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: "0 15px 30px rgba(0,0,0,0.05)",
                      borderLeft: "5px solid #6a11cb",
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} mb={1}>
                      {card.title}
                    </Typography>
                    <Typography color="text.secondary">{card.text}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </SectionAlt>

        {/* ================= TECHNOLOGY ================= */}
        <Section>
          <Typography variant="h4" mb={2}>
            🛠 Technology Stack
          </Typography>
          <Typography paragraph>
            Our system is engineered using modern, industry-proven technologies:
          </Typography>
          <Stack spacing={1} pl={2}>
            {[
              "Java & Spring Boot (Backend)",
              "Spring Security with JWT",
              "React (Frontend)",
              "MySQL & Hibernate (Persistence)",
              "RESTful APIs & layered architecture",
            ].map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Typography>• {tech}</Typography>
              </motion.div>
            ))}
          </Stack>
        </Section>

        {/* ================= FOUNDER NOTE ================= */}
        <SectionAlt>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" mb={2}>
              👨‍💻 Founder’s Note
            </Typography>
            <Typography paragraph>
              This platform was designed and developed with a strong focus on clean architecture, real-world business rules, and long-term scalability. It reflects a deep understanding of enterprise application design, gained through hands-on development and continuous learning.
            </Typography>
            <Typography paragraph>
              We believe great software is not just about features, but about correctness, clarity, and trust.
            </Typography>
          </motion.div>
        </SectionAlt>
      </Container>
    </Box>
  );
}

/* ================= REUSABLE SECTION COMPONENTS ================= */

function Section({ children }) {
  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        p: 5,
        borderRadius: 3,
        mb: 6,
        boxShadow: "0 10px 20px rgba(0,0,0,0.03)",
      }}
    >
      {children}
    </Box>
  );
}

function SectionAlt({ children }) {
  return (
    <Box
      sx={{
        bgcolor: "#f1f5f9",
        p: 5,
        borderRadius: 3,
        mb: 6,
        border: "1px solid #e2e8f0",
      }}
    >
      {children}
    </Box>
  );
}
