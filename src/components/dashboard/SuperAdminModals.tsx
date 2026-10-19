import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import { X, MessageSquare, Send, LifeBuoy } from 'lucide-react'
import type { SchoolRegistrationRow } from './dashboardData'

export interface AddSchoolModalProps {
  open: boolean
  onClose: () => void
  onSchoolAdded: (school: SchoolRegistrationRow) => void
}

export const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  open,
  onClose,
  onSchoolAdded,
}) => {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Bihar')
  const [plan, setPlan] = useState<'Starter' | 'Professional' | 'Enterprise'>('Professional')
  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newSchool: SchoolRegistrationRow = {
      id: String(Date.now()),
      name: name.trim(),
      location: `${city.trim() || 'Patna'}, ${state}`,
      plan,
      date: 'Today',
      status: 'Active',
    }

    onSchoolAdded(newSchool)
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setName('')
      setCity('')
      setEmail('')
      onClose()
    }, 1200)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 1,
            boxShadow: '0 20px 40px rgba(15,23,42,0.15)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 800,
          color: '#0f172a',
          pb: 1,
        }}
      >
        <span>Add New Institutional School</span>
        <IconButton size="small" onClick={onClose} sx={{ color: '#94a3b8' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {isSuccess && (
            <Alert severity="success" sx={{ borderRadius: '10px' }}>
              School registered successfully into AxioNexa ERP!
            </Alert>
          )}

          <TextField
            label="School Name"
            fullWidth
            required
            size="small"
            placeholder="e.g. St. Xavier International"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="City"
              fullWidth
              size="small"
              placeholder="e.g. Patna"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <TextField
              label="State"
              fullWidth
              size="small"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </Box>

          <TextField
            label="Institutional Email"
            fullWidth
            size="small"
            type="email"
            placeholder="admin@school.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            select
            label="Subscription Plan"
            fullWidth
            size="small"
            value={plan}
            onChange={(e) => setPlan(e.target.value as any)}
          >
            <MenuItem value="Starter">Starter (Up to 500 students)</MenuItem>
            <MenuItem value="Professional">Professional (Up to 2,500 students)</MenuItem>
            <MenuItem value="Enterprise">Enterprise (Unlimited campuses)</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#1e60f0',
              color: '#ffffff',
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              '&:hover': { bgcolor: '#154ecc' },
            }}
          >
            Register School
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export const FloatingSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hello Super Admin! How can AxioNexa Enterprise Support assist you today?',
    },
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const userText = message.trim()
    setMessages((prev) => [...prev, { sender: 'user', text: userText }])
    setMessage('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Ticket logged: "${userText}". An AxioNexa technical specialist will contact you shortly.`,
        },
      ])
    }, 800)
  }

  return (
    <>
      {/* Floating Action Button at Bottom-Right */}
      <Box
        onClick={() => setIsOpen((prev) => !prev)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1200,
          width: 52,
          height: 52,
          borderRadius: '50%',
          bgcolor: '#1e60f0',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(30, 96, 240, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          '&:hover': {
            bgcolor: '#154ecc',
            transform: 'scale(1.06)',
          },
        }}
        title="Enterprise Live Support"
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </Box>

      {/* Popover Chat Drawer */}
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 86,
            right: 24,
            width: { xs: 300, sm: 360 },
            bgcolor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(15,23,42,0.18)',
            zIndex: 1200,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 480,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: '#1e60f0',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LifeBuoy size={20} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  AxioNexa Priority Support
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '0.7rem' }}>
                  Super Admin Direct Desk
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: '#ffffff' }}>
              <X size={16} />
            </IconButton>
          </Box>

          {/* Messages list */}
          <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 300 }}>
            {messages.map((m, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  p: 1.25,
                  borderRadius: m.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  bgcolor: m.sender === 'user' ? '#1e60f0' : '#f1f5f9',
                  color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                  fontSize: '0.8rem',
                }}
              >
                {m.text}
              </Box>
            ))}
          </Box>

          {/* Input bar */}
          <Box
            component="form"
            onSubmit={handleSend}
            sx={{
              p: 1.5,
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Ask support or report issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem', py: 0.8 } }}
            />
            <IconButton type="submit" sx={{ bgcolor: '#1e60f0', color: '#ffffff', '&:hover': { bgcolor: '#154ecc' } }}>
              <Send size={16} />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  )
}
