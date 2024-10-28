import React from "react";
import { Typography, List, Button } from "antd";
import {
  CrownOutlined,
  CheckCircleOutlined,
  VideoCameraOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useTheme } from "../themeLightDark/ThemeProvider"; // Import useTheme

const { Title, Paragraph } = Typography;

function Rules() {
  const { theme } = useTheme(); // Get current theme from context

  // Define styles for light and dark themes
  const themeStyles = {
    backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
    color: theme === "dark" ? "#f5f5f5" : "#000000",
    borderColor: theme === "dark" ? "#333" : "#FFA500",
  };

  return (
    <div
      className="max-w-6xl mx-auto p-6 rounded-lg shadow-lg my-5"
      style={{ ...themeStyles, border: `1px solid ${themeStyles.borderColor}` }}
    >
      <div className="p-5 rounded-lg mb-6 text-center">
        <Title level={2} style={{ color: themeStyles.color }}>
          <CrownOutlined
            className="mr-2"
            style={{ color: "#E56112", fontSize: "24px" }}
          />
          Explore, connect, and excel with Go! Study - your pathway to success!
        </Title>
      </div>

      <div className="mb-6">
        <Title level={3} style={{ color: themeStyles.color }}>
          <CheckCircleOutlined className="mr-2" />
          Community Guidelines
        </Title>
        <List
          dataSource={[
            "1. We're here to help. The StudyStream team is authorized to enforce its rules at all times.",
            "2. Respect & Good Vibes: Be open-minded and kind to help create a positive atmosphere.",
            "3. If you see something, say something: Report rule violations to ensure a safe and respectful environment.",
            "4. Manage your own experience: Block users or hide their video streams if necessary.",
            "5. Safety: Do not disclose personal information that may compromise your privacy or security.",
          ]}
          renderItem={(item) => (
            <List.Item style={{ color: themeStyles.color }}>{item}</List.Item>
          )}
        />
      </div>

      <div className="mb-6">
        <Title level={3} style={{ color: themeStyles.color }}>
          <CheckCircleOutlined className="mr-2" />
          General Rules
        </Title>
        <List
          dataSource={[
            <span>
              <strong>1. Appropriate etiquette:</strong> No inappropriate or
              offensive usernames, profile pictures, or biography descriptions.
            </span>,
            <span>
              <strong>2. Consent:</strong> Do not share information about other
              users without their explicit consent.
            </span>,
            <span>
              <strong>3. No harassment:</strong> No abuse of any form including
              insults, threats, bullying, trolling, or personal attacks towards
              others.
            </span>,
            <span>
              <strong>4. No discrimination:</strong> No incitement, prejudiced
              treatment, or hatred of others based on protected characteristics
              (such as race, gender, age, sexual orientation, religion,
              nationality, disability, etc).
            </span>,
            <span>
              <strong>5. No NSFW content:</strong> No offensive, disturbing, or
              sexually explicit content. No content related to violence,
              weapons, or recreational drugs.
            </span>,
            <span>
              <strong>6. No avoidance:</strong> Creating multiple accounts to
              evade penalties is strictly prohibited.
            </span>,
            <span>
              <strong>7. No promotion:</strong> Do not promote or advertise,
              directly or indirectly, without permission.
            </span>,
            <span>
              <strong>8. No impersonation:</strong> Do not pretend to be someone
              else.
            </span>,
            <span>
              <strong>9. No misusing the report system:</strong> Do not submit
              fake reports, or make false allegations against others.
            </span>,
          ]}
          renderItem={(item) => (
            <List.Item style={{ color: themeStyles.color }}>{item}</List.Item>
          )}
        />
      </div>

      <div className="mb-6">
        <Title level={3} style={{ color: themeStyles.color }}>
          <VideoCameraOutlined className="mr-2" />
          Focus Room Rules
        </Title>
        <Paragraph style={{ color: themeStyles.color }}>
          Video conduct: Avoid intentionally distracting, inappropriate,
          disruptive, and offensive behavior and presentation. This includes
          clothing, backgrounds, filters, tile messages, and audio (where it's
          available).
        </Paragraph>
      </div>

      <div className="mb-6">
        <Title level={3} style={{ color: themeStyles.color }}>
          <MessageOutlined className="mr-2" />
          Chat Rules
        </Title>
        <List
          dataSource={[
            '1. No inappropriate messaging: No unwelcome, spamming, or "creeping" messages. No profanity.',
            "2. Language: Please use English in all public spaces unless stated otherwise in designated spaces.",
          ]}
          renderItem={(item) => (
            <List.Item style={{ color: themeStyles.color }}>{item}</List.Item>
          )}
        />
      </div>

      <div className="mb-6">
        <Paragraph style={{ color: themeStyles.color }}>
          <strong>Talk to us:</strong> To speak to the moderation team or query
          a moderation decision, please email gostudy.go01@gmail.com
        </Paragraph>
        <Paragraph style={{ color: themeStyles.color }}>
          <strong>Disclaimer:</strong> Moderators reserve the right to modify
          rules and exercise any moderation action deemed necessary at all
          times.
        </Paragraph>
      </div>

      <Button type="primary" className="w-full">
        Share
      </Button>
    </div>
  );
}

export default Rules;
