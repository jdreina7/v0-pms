"use client"

import type React from "react"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useIntl } from "react-intl"

interface Column<T> {
  id: string
  label: string
  render: (row: T) => React.ReactNode
  align?: "left" | "right" | "center"
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  isLoading?: boolean
  error?: string | null
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  error = null,
}: DataTableProps<T>) {
  const intl = useIntl()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Asegurarse de que data siempre sea un array
  const safeData = Array.isArray(data) ? data : []

  // Filtrar datos según término de búsqueda
  const filteredData = safeData.filter((row) => {
    if (!searchTerm) return true

    // Buscar en todas las propiedades del objeto
    return Object.values(row).some((value) => {
      if (value === null || value === undefined) return false
      if (typeof value === "object") return false
      return String(value).toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Paginación
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={intl.formatMessage({ id: "common.search" })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: (theme) => (theme.palette.mode === "light" ? "#f8fafc" : "#1f2937"),
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {intl.formatMessage({ id: "common.loading" })}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                  <Typography>{intl.formatMessage({ id: "common.noData" })}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow hover tabIndex={-1} key={keyExtractor(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || "left"}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
