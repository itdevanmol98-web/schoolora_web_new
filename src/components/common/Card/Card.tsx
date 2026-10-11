import React from 'react'
import MuiCard, { type CardProps as MuiCardProps } from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export interface CardProps extends Omit<MuiCardProps, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  headerAction?: React.ReactNode
  headerAvatar?: React.ReactNode
  footer?: React.ReactNode
  disableContentPadding?: boolean
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  headerAction,
  headerAvatar,
  footer,
  children,
  disableContentPadding = false,
  sx,
  ...rest
}) => {
  const effectiveAction = action || headerAction
  const hasHeader = Boolean(title || subtitle || effectiveAction || headerAvatar)

  return (
    <MuiCard sx={sx} {...rest}>
      {hasHeader && (
        <CardHeader
          avatar={headerAvatar}
          action={effectiveAction}
          title={
            typeof title === 'string' ? (
              <Typography variant="h6" component="div">
                {title}
              </Typography>
            ) : (
              title
            )
          }
          subheader={
            typeof subtitle === 'string' ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : (
              subtitle
            )
          }
          sx={{ pb: children ? 1 : 2 }}
        />
      )}
      {children && (
        <CardContent
          sx={{
            p: disableContentPadding ? 0 : 2.5,
            '&:last-child': { pb: footer ? 1 : 2.5 },
          }}
        >
          {children}
        </CardContent>
      )}
      {footer && (
        <CardActions sx={{ px: 2.5, pb: 2, pt: 0 }}>
          <Box sx={{ width: '100%' }}>{footer}</Box>
        </CardActions>
      )}
    </MuiCard>
  )
}

export { Card as AppCard }
export type { CardProps as AppCardProps }
export default Card
