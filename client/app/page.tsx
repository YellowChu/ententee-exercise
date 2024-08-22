"use client";

import moment from "moment";
import axios from "@/app/(axios)";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";

import TheCard from "@/app/(components)/TheCard";
import TheButton from "@/app/(components)/TheButton";
import { useFetch } from "@/app/(hooks)/useFetch";
import { Task } from "@/app/(types)";
import { parse } from "path";

interface TaskResponse {
  total: number;
  num_pages: number;
  current_page: number;
  items: Task[];
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const { data, loading, error, fetch } = useFetch<TaskResponse>(
    `/api/v1/tasks/?page=${page}&search=${search}&sort=${sort}`
  );

  useEffect(() => {
    fetch();
  }, []);

  const priorityOptions = [
    { value: 100, label: "Low" },
    { value: 200, label: "Medium" },
    { value: 300, label: "High" },
  ]

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: 100,
  });

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setNewTask({
      ...newTask,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      console.log(newTask);
      await axios.post("/api/v1/tasks/", newTask);
      fetch();
    } catch (error) {
      alert("An error occurred");
    }
  };

  const sortOptions = [
    { value: "created", label: "Created" },
    { value: "title", label: "Title" },
    { value: "priority", label: "Priority" },
  ]

  const previousPage = () => {
    if (page === 1) return;
  
    setPage((prev => parseInt(prev as string) - 1));
    fetch();
  }

  const nextPage = () => {
    if (page === data?.num_pages) return;
  
    setPage((prev => parseInt(prev as string) + 1));
    fetch();
  }

  return (
    <>
      {page} {search} {sort}
      <div className="flex justify-between">
        <h1 className="text-2xl font-medium">Tasks</h1>

        <div className="flex gap-2">
          <input
            className="p-2 border border-gray-300 rounded"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <TheButton onClick={() => fetch()}>Search</TheButton>
        </div>
      </div>

      <div className="mt-8">
        <TheCard>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="text-base font-medium">Title</label>
              <input
                id="title"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Title"
                name="title"
                value={newTask.title}
                onChange={handleChange}
              />
            </div>

            <div className="mt-2">
              <label htmlFor="description" className="text-base font-medium">Description</label>
              <textarea
                id="description"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="What did I do today?"
                name="description"
                value={newTask.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
              <div>
                <label htmlFor="priority" className="text-base font-medium">Priority</label>
                <select
                  id="priority"
                  className="w-full p-2 border border-gray-300 rounded"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end w-full">
              <TheButton type="submit">Submit</TheButton>
            </div>
          </form>
        </TheCard>
      </div>

      <div className="mt-8">
        <TheCard>
          <div>
            <label htmlFor="sort" className="text-base font-medium">Sort by</label>
            <select
              id="sort"
              className="w-full p-2 border border-gray-300 rounded"
              name="sort"
              value={sort}
              onChange={(event) => setSort(event.currentTarget.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <div className="flex justify-end w-full mt-2">
              <TheButton onClick={fetch}>Sort</TheButton>
            </div>
          </div>
        </TheCard>
      </div>

      <div className="flex justify-between items-center gap-2 mt-8">
        <TheButton onClick={previousPage}>
          &lt;-
        </TheButton>

        <div>
          Current page: {page}
        </div>

        <TheButton onClick={nextPage}>
          -&gt;
        </TheButton>
      </div>

      <div className="mt-8">
        {data !== null && data.items.map((task) => (
          <div key={task.id} className="mb-4">
            <TheCard>
              <div className="flex justify-between">
                <h2 className="text-lg font-medium">{task.title}</h2>
                <div className="text-xs px-2 py-2 rounded-md bg-slate-200 text-slate-800">{task.priority.label}</div>
              </div>
              <div className="text-xs text-slate-500">{moment(task.created).calendar()}</div>
              <p className="truncate mt-4">{task.description}</p>
            </TheCard>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-2">
        <TheButton onClick={previousPage}>
          &lt;-
        </TheButton>

        <div>
          Current page: {page}
        </div>

        <TheButton onClick={nextPage}>
          -&gt;
        </TheButton>
      </div>
    </>
  );
}
