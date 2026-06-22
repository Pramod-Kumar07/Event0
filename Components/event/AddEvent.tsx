"use client";

import Input from "../FormComponents/Input";
import Button from "../UI/Button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type VenueOption = {
  _id: string;
  name: string;
  address: string;
  state: string;
};

type EventFormValues = {
  artist: string;
  venu: string;
  description: string;
  date: string;
};

function AddEvent() {
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [venueError, setVenueError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    defaultValues: {
      artist: "",
      venu: "",
      description: "",
      date: "",
    },
  });

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoadingVenues(true);
        const res = await fetch("/api/venu");
        const response = await res.json();

        if (response.status === 200) {
          setVenues(response.data ?? []);
          return;
        }

        setVenueError(response.message ?? "Unable to load venues");
      } catch {
        setVenueError("Unable to load venues");
      } finally {
        setLoadingVenues(false);
      }
    };

    void loadVenues();
  }, []);

  const onSubmit = async (values: EventFormValues) => {
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const response = await res.json();

      if (response.status === 200) {
        setSubmitMessage(response.message ?? "Event created successfully");
        reset();
        return;
      }

      setSubmitMessage(response.message ?? "Unable to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center">
      <h2 className="text-lg font-semibold">Add Event</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 w-full space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <Input
          type="text"
          label="Artist Performing"
          placeholder="Enter artist name"
          registration={register("artist", {
            required: "Artist name is required",
          })}
          error={errors.artist?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-900" htmlFor="venu">
            Venue Address
          </label>
          <select
            id="venu"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
            disabled={loadingVenues}
            {...register("venu", {
              required: "Venue is required",
            })}
          >
            <option value="">
              {loadingVenues ? "Loading venues..." : "Select a venue"}
            </option>
            {venues.map((venue) => (
              <option key={venue._id} value={venue._id}>
                {venue.name} - {venue.address}, {venue.state}
              </option>
            ))}
          </select>
          {errors.venu?.message ? (
            <p className="text-sm text-red-600">{errors.venu.message}</p>
          ) : null}
          {venueError ? (
            <p className="text-sm text-red-600">{venueError}</p>
          ) : null}
        </div>

        <Input
          type="textarea"
          label="Description"
          placeholder="Enter event description"
          registration={register("description", {
            required: "Description is required",
          })}
          error={errors.description?.message}
        />

        <Input
          type="date"
          label="Date"
          placeholder="Enter date"
          registration={register("date", {
            required: "Date is required",
          })}
          error={errors.date?.message}
        />

        <Button type="submit" fullWidth loading={submitting}>
          Add
        </Button>

        {submitMessage ? (
          <p className="text-sm text-zinc-600">{submitMessage}</p>
        ) : null}
      </form>
    </div>
  );
}

export default AddEvent;
