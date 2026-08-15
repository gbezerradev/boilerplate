"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@boilerplate/ui/components/alert-dialog";
import { Button } from "@boilerplate/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";
import { Field, FieldDescription, FieldLabel } from "@boilerplate/ui/components/field";
import { Input } from "@boilerplate/ui/components/input";
import { Skeleton } from "@boilerplate/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@boilerplate/ui/components/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";
import { formatBytes, formatDate } from "@/lib/format";

export default function FilesPageContent() {
  const queryClient = useQueryClient();
  const status = useQuery(trpc.storage.status.queryOptions());
  const files = useQuery(trpc.storage.list.queryOptions());
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const createUpload = useMutation(trpc.storage.createUpload.mutationOptions());
  const completeUpload = useMutation(trpc.storage.completeUpload.mutationOptions());
  const download = useMutation(
    trpc.storage.download.mutationOptions({
      onSuccess: ({ url }) => window.location.assign(url),
      onError: (error) => toast.error(error.message),
    }),
  );
  const remove = useMutation(
    trpc.storage.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("File deleted.");
        await queryClient.invalidateQueries({ queryKey: trpc.storage.list.queryKey() });
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  if (status.isPending || files.isPending) return <Skeleton className="h-80 w-full" />;

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Files</h1>
        <p className="text-sm text-muted-foreground">
          Tenant-scoped uploads backed by signed S3 requests.
        </p>
      </header>
      {!status.data?.enabled ? (
        <Card>
          <CardHeader>
            <CardTitle>Storage is disabled</CardTitle>
            <CardDescription>
              Configure the S3 environment variables to enable uploads.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Upload a file</CardTitle>
            <CardDescription>
              Maximum size: {formatBytes(status.data.maxUploadBytes)}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!file) return;
                setUploading(true);
                try {
                  const upload = await createUpload.mutateAsync({
                    name: file.name,
                    contentType: file.type || "application/octet-stream",
                    size: file.size,
                  });
                  const response = await fetch(upload.url, {
                    method: upload.method,
                    headers: upload.headers,
                    body: file,
                  });
                  if (!response.ok) throw new Error(`Upload failed with status ${response.status}`);
                  await completeUpload.mutateAsync({ id: upload.id });
                  setFile(undefined);
                  await queryClient.invalidateQueries({ queryKey: trpc.storage.list.queryKey() });
                  toast.success("File uploaded.");
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Upload failed");
                } finally {
                  setUploading(false);
                }
              }}
            >
              <Field className="flex-1">
                <FieldLabel htmlFor="file-upload">File</FieldLabel>
                <Input
                  id="file-upload"
                  name="file"
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp,application/pdf,application/json,application/zip,text/plain,text/csv"
                  onChange={(event) => setFile(event.target.files?.[0])}
                  required
                />
                <FieldDescription>
                  Images, documents, JSON, CSV and ZIP files are allowed.
                </FieldDescription>
              </Field>
              <Button type="submit" disabled={!file || uploading}>
                <Upload />
                {uploading ? "Uploading…" : "Upload"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Workspace files</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.data?.length ? (
                files.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.contentType}</p>
                    </TableCell>
                    <TableCell>{formatBytes(item.size)}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Download ${item.name}`}
                          onClick={() => download.mutate({ id: item.id })}
                        >
                          <Download />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Delete ${item.name}`}
                              />
                            }
                          >
                            <Trash2 />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes the file from storage.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => remove.mutate({ id: item.id })}
                              >
                                Delete file
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    No files uploaded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
