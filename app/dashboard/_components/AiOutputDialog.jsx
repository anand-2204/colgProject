import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden

const AlertDialogDemo = () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <button className="inline-flex h-[35px] items-center justify-center rounded bg-violet4 px-[15px] font-medium leading-none text-violet11 outline-none outline-offset-1 hover:bg-mauve3 focus-visible:outline-2 focus-visible:outline-violet6 select-none">
        Delete account
      </button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
      <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg focus:outline-none">
        
        {/* Use VisuallyHidden to hide the title visually but keep it accessible */}
        <VisuallyHidden>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        </VisuallyHidden>

        {/* Optional description */}
        <AlertDialog.Description className="mt-2 text-sm text-gray-700">
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </AlertDialog.Description>

        <div className="mt-4 flex justify-end gap-3">
          <AlertDialog.Cancel asChild>
            <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900">
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
              Yes, delete
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default AlertDialogDemo;
