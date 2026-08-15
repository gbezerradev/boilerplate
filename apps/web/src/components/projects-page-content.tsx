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
import { Card, CardContent, CardHeader, CardTitle } from "@boilerplate/ui/components/card";
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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";
import { formatDate } from "@/lib/format";

export default function ProjectsPageContent() {
  const queryClient = useQueryClient();
  const projects = useQuery(trpc.projects.list.queryOptions());
  const [name, setName] = useState("");
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: async () => {
        setName("");
        toast.success("Project created.");
        await queryClient.invalidateQueries({ queryKey: trpc.projects.list.queryKey() });
      },
      onError: (error) => toast.error(error.message),
    }),
  );
  const deleteProject = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Project deleted.");
        await queryClient.invalidateQueries({ queryKey: trpc.projects.list.queryKey() });
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          A tenant-scoped example resource for your SaaS.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              if (name.trim().length >= 2) createProject.mutate({ name: name.trim() });
            }}
          >
            <Field className="flex-1">
              <FieldLabel htmlFor="project-name">Project name</FieldLabel>
              <Input
                id="project-name"
                name="projectName"
                autoComplete="off"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={120}
                required
              />
              <FieldDescription>
                The server derives the workspace from your session.
              </FieldDescription>
            </Field>
            <Button type="submit" disabled={createProject.isPending || name.trim().length < 2}>
              {createProject.isPending ? "Creating…" : "Create project"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Workspace projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.isPending ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-16 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.data?.length ? (
                  projects.data.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{formatDate(project.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Delete ${project.name}`}
                              />
                            }
                          >
                            <Trash2 />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {project.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Only this workspace&apos;s project
                                will be removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => deleteProject.mutate({ id: project.id })}
                              >
                                Delete project
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                      No projects yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
