import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PrintPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string | null
  paperLabel: string
  widthMm: number
  onPrint: () => void
}

export function PrintPreviewDialog({
  open,
  onOpenChange,
  imageUrl,
  paperLabel,
  widthMm,
  onPrint,
}: PrintPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-hidden sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <DialogDescription>
            {paperLabel} · Sample data · Không hiển thị grid/ruler
          </DialogDescription>
        </DialogHeader>

        <div className='bg-muted/40 flex max-h-[60vh] items-center justify-center overflow-auto rounded-md border p-6'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt='Template preview'
              className='max-h-[55vh] w-auto shadow-md'
              style={{
                maxWidth: `${Math.min(widthMm * 2.5, 720)}px`,
              }}
            />
          ) : (
            <p className='text-muted-foreground text-sm'>Đang tạo preview...</p>
          )}
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button type='button' onClick={onPrint}>
            <Printer className='size-4' />
            In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
