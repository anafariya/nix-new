'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';

interface SS {
  id: string;
}

export const ShareScreenshot: React.FC<SS> = ({ id }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  //   const captureScreenshot = async () => {
  //     const element = document.getElementById(id);
  //     if (!element) return;

  //     // Temporarily expand overflow to capture full scroll
  //     const originalOverflow = element.style.overflow;
  //     element.style.overflow = 'visible';

  //     const canvas = await html2canvas(element, {
  //       scrollX: 0,
  //       scrollY: 0,
  //       useCORS: true,
  //       width: element.scrollWidth,
  //       height: element.scrollHeight,
  //       windowWidth: element.scrollWidth,
  //       windowHeight: element.scrollHeight,
  //     });

  //     element.style.overflow = originalOverflow;

  //     const dataUrl = canvas.toDataURL('image/png');
  //     setImageUrl(dataUrl);
  //     setOpen(true);
  //   };

  const captureScreenshot = async () => {
    console.log(id);
    const element = document.getElementById(id);
    if (!element) return;
    // Find scrollable children inside
    const scrollables = element.querySelectorAll<HTMLElement>('*');

    const style = window.getComputedStyle(element);
    let overflow = style.overflow || 'none';
    // Save original styles
    const originalStyles: {
      el: HTMLElement;
      overflow: string;
      height: string;
    }[] = [];

    if (id === 'flight-details-with-fare')
      scrollables.forEach((el) => {
        const style = window.getComputedStyle(el);

        // Only save scrollable elements (auto, scroll, or visible)

        if (el.id === 'flight-dialog-title') {
          originalStyles.push({
            el,
            overflow: el.style.overflow,
            height: el.style.height,
          });

          // Special case for title, don't scroll
          el.style.overflow = 'hidden';
          el.style.height = `0px`;
        } else if (
          style.overflow === 'auto' ||
          style.overflowY === 'auto' ||
          style.overflowY === 'scroll' ||
          style.overflow === 'scroll' ||
          style.overflowY !== 'visible'
        ) {
          originalStyles.push({
            el,
            overflow: el.style.overflow,
            height: el.style.height,
          });
          el.style.overflow = 'visible';
          // el.style.height = `${el.scrollHeight}px`;
        }
      });
    else element.style.overflow = 'visible';

    const canvas = await html2canvas(element, {
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Restore original styles
    originalStyles.forEach(({ el, overflow, height }) => {
      el.style.overflow = overflow;
      el.style.height = height;
    });

    element.style.overflow = overflow;

    const dataUrl = canvas.toDataURL('image/png');
    setImageUrl(dataUrl);
    setOpen(true);
  };

  const handleNativeShare = async () => {
    if (!imageUrl) return;
    const blob = await (await fetch(imageUrl)).blob();
    const file = new File([blob], 'screenshot.png', { type: blob.type });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          text: 'Check this out!',
          title: 'Shared Screenshot',
        });
      } catch (err) {
        console.error('Share canceled or failed:', err);
      }
    } else {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'screenshot.png';
      link.click();
    }
  };

  const shareOnWhatsApp = (imageUrl: string) => {
    const message = encodeURIComponent(`Here's the screenshot:\n${imageUrl}`);
    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  const handleWhatsApp = async () => {
    if (!imageUrl) return;

    // Step 1: Auto download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'screenshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Step 2: Open WhatsApp with message
    const message = encodeURIComponent('Check out this screenshot! 📸');
    window.open(`https://wa.me/?text=${message}`, '_blank');

    shareOnWhatsApp(imageUrl || '');
  };

  const shareByEmail = async (imageUrl: string = '') => {
    const subject = encodeURIComponent('Check out this screenshot 📸');
    // const body = encodeURIComponent(
    //   `Here's the screenshot from the website.\n\nIf the image didn't attach automatically, you can download it here:\n${imageUrl}`
    // );

    console.log(imageUrl);
    const body = encodeURIComponent(
      `Here's the screenshot from the website.\n\nIf the image didn't attach automatically, you can download it here:\n${'https://nixtour-new.vercel.app/flight-search'}`
    );

    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;

    // 1. Try mailto
    const newWindow = window.open(mailtoUrl, '_blank');

    // 2. If mailto fails, fallback to Gmail compose
    setTimeout(() => {
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === 'undefined'
      ) {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
      }
    }, 500);
  };

  const handleEmail = () => {
    // const subject = encodeURIComponent('Shared Screenshot');
    // const body = encodeURIComponent('Check this out!');
    shareByEmail(imageUrl || '');
    // window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Button
        onClick={captureScreenshot}
        className="bg-[#BC1110] hover:bg-[#BC1110]/90 text-white md:rounded-full w-full md:w-fit"
      >
        📸 Share
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 max-h-[90dvw] rounded-2xl sm:rounded-2xl overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none]">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Share Screenshot</DialogTitle>
          </DialogHeader>

          {imageUrl && (
            <div className="p-4">
              <img
                src={imageUrl}
                alt="Screenshot preview"
                className="w-full rounded-lg border mb-4"
              />
              <div className="flex gap-2 justify-end flex-wrap">
                <Button
                  onClick={handleNativeShare}
                  className="bg-[#BC1110] hover:bg-[#BC1110]/90 text-white rounded-full"
                >
                  Native Share
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleWhatsApp}
                  className="hover:bg-[#BC1110]/90 hover:text-white rounded-full"
                >
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEmail}
                  className="hover:bg-[#BC1110]/90 hover:text-white rounded-full"
                >
                  Email
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                ⚠️ WhatsApp does not support image sharing through links. The
                screenshot will be auto-downloaded — just attach it in the chat.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
