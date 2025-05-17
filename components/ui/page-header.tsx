"use client"

import type React from "react"

import { Box, Typography, Breadcrumbs, Link as MuiLink } from "@mui/material"
import Link from "next/link"
import { useIntl } from "react-intl"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  breadcrumbs?: BreadcrumbItem[]
  action?: React.ReactNode
}

export default function PageHeader({ title, breadcrumbs, action }: PageHeaderProps) {
  const intl = useIntl()

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {title}
        </Typography>
        {action}
      </Box>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/dashboard" passHref legacyBehavior>
            <MuiLink color="inherit" underline="hover">
              {intl.formatMessage({ id: "dashboard.title" })}
            </MuiLink>
          </Link>

          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1

            return isLast ? (
              <Typography key={index} color="text.primary">
                {item.label}
              </Typography>
            ) : (
              <Link key={index} href={item.href || "#"} passHref legacyBehavior>
                <MuiLink color="inherit" underline="hover">
                  {item.label}
                </MuiLink>
              </Link>
            )
          })}
        </Breadcrumbs>
      )}
    </Box>
  )
}
