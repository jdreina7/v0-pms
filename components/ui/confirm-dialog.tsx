"use client"

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"
import { useIntl } from "react-intl"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const intl = useIntl()

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          {cancelText || intl.formatMessage({ id: "common.cancel" })}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained" autoFocus disabled={isLoading}>
          {confirmText || intl.formatMessage({ id: "common.confirm" })}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
