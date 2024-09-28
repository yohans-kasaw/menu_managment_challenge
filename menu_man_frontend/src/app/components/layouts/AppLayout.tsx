"use client";

import React, { useState } from "react";
import { Layout } from "antd";
import { useMediaQuery } from "react-responsive";
import { MenuOutlined } from "@ant-design/icons";
import SidebarMenu from "./SidebarMenu"; // Importing a separate component for the SidebarMenu
import FolderOutlined from "@ant-design/icons/FolderOutlined";

const { Header, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar for larger screens */}
      <aside
        className={`hidden md:flex flex-col w-64 bg-[#1E2124] text-white p-4 rounded-r-3xl ${mobileMenuOpen ? "block" : ""}`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">CLOIT</h1>
          <MenuOutlined
            className="text-white text-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
        <nav>
          <SidebarMenu />
        </nav>
      </aside>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-0 left-0 m-4 z-20 ${mobileMenuOpen ? "hidden" : ""}`}
      >
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-800 hover:text-gray-600"
        >
          <MenuOutlined className="text-2xl" />
        </button>
      </div>

      {/* Main content area */}
      <main className="flex-1 p-4">
        <Header className="bg-white p-6">
          <div className="text-sm text-gray-800 mb-4 flex items-center">
            <FolderOutlined
              className="mr-1 text-gray-800"
              style={{ fontSize: "16px" }}
            />
            <span className="mx-1">/</span>
            <span className="text-gray-800">Menus</span>
          </div>
        </Header>
        <Content className="p-4">{children}</Content>
      </main>
    </div>
  );
};

export default AppLayout;
