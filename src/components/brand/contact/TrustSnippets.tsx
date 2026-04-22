import { FC } from 'react'
import { ShieldCheckIcon, ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/outline'

export const TrustSnippets: FC = () => {
  return (
    <div className="flex flex-col gap-6 p-8 bg-brand-surface border border-brand-border/50 rounded-2xl">
      <h3 className="font-display text-xl font-semibold text-brand-ink mb-2">Why reach out?</h3>
      
      <div className="flex gap-4">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-muted/50">
          <ClockIcon className="h-5 w-5 text-brand-ink" />
        </div>
        <div>
          <h4 className="font-medium text-brand-ink text-sm">Fast Response</h4>
          <p className="text-brand-xs text-brand-muted-foreground mt-1 leading-relaxed">
            We aim to reply to all inquiries within 2 hours during business operations.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-muted/50">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-brand-ink" />
        </div>
        <div>
          <h4 className="font-medium text-brand-ink text-sm">Expert Guidance</h4>
          <p className="text-brand-xs text-brand-muted-foreground mt-1 leading-relaxed">
            Speak directly with our certified optical specialists, not an automated bot.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-muted/50">
          <ShieldCheckIcon className="h-5 w-5 text-brand-ink" />
        </div>
        <div>
          <h4 className="font-medium text-brand-ink text-sm">Secure & Private</h4>
          <p className="text-brand-xs text-brand-muted-foreground mt-1 leading-relaxed">
            Your medical and prescription details are handled with strict confidentiality.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-brand-border/50">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-brand-border/50 border-2 border-brand-surface shrink-0 flex items-center justify-center text-[10px]">✨</div>
            <div className="w-8 h-8 rounded-full bg-brand-border/50 border-2 border-brand-surface shrink-0 flex items-center justify-center text-[10px]">👓</div>
            <div className="w-8 h-8 rounded-full bg-brand-border/50 border-2 border-brand-surface shrink-0 flex items-center justify-center text-[10px]">🌟</div>
          </div>
          <p className="text-xs font-medium text-brand-muted-foreground">
            Trusted by 10,000+ customers
          </p>
        </div>
      </div>
    </div>
  )
}
