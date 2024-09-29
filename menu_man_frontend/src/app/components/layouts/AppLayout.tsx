// AppLayout.tsx
"use client";

import React, { useState, useCallback } from "react";
import { Layout } from "antd";
import { MenuOutlined, FolderOutlined } from "@ant-design/icons";
import SidebarMenu from "./SidebarMenu";
import { useResponsive } from "@/lib/hooks"; // Assuming you have created this custom hook

const { Header, Content } = Layout;

const MOBILE_WIDTH_THRESHOLD = 767;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useResponsive(MOBILE_WIDTH_THRESHOLD);

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prevState) => !prevState);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out" : "relative"}
          ${isMobile && !mobileMenuOpen ? "-translate-x-full" : "translate-x-0"}
          ${isMobile ? "w-64" : "hidden md:block w-64"}
          flex-shrink-0 bg-gray-800 text-white
          rounded-r-3xl
        `}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">CLOIT</h1>
          {isMobile && (
            <button onClick={handleToggleMobileMenu} className="text-white">
              <MenuOutlined className="text-xl" />
            </button>
          )}
        </div>
        <nav className="mt-8">
          <SidebarMenu />
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header className="bg-white border-b border-gray-200">
          <div className="text-sm text-gray-800 py-4 px-6 flex items-center">
            {isMobile && (
              <button
                onClick={handleToggleMobileMenu}
                className="text-gray-800 mr-4"
              >
                <MenuOutlined className="text-2xl" />
              </button>
            )}
            <FolderOutlined
              className="text-gray-800 mr-2"
              style={{ fontSize: "16px" }}
            />
            <span className="mx-1">/</span>
            <span className="text-gray-800">Menus</span>
          </div>
        </Header>

        {/* Content */}
        <Content className="flex-1 overflow-auto p-6">{children}</Content>
      </div>

      {/* Overlay for mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={handleToggleMobileMenu}
        ></div>
      )}
    </div>
  );
};

export default AppLayout;
