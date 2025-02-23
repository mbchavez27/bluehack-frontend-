import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// @ts-ignore
import { ZemmParser } from "zemm-protocol";
// @ts-ignore
import { sendSMSMessage } from "macky-sms";

const formSchema = z.object({
  name: z.string(),
  headCount: z.string(),
  desc: z.string(),
  image: z.string(),
});

function Menu({ lat, lng }: { lat: number; lng: number }) {
  const [menuState, setMenu] = useState(0);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const zemmy = new ZemmParser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      headCount: "1",
      desc: "",
      image: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
        form.setValue("image", base64String);
      };
    }
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = { data: { number: "09275270464", ...values, lat, lng } };
    console.log(data);
    const zemm = zemmy.encode(data);
    sendSMSMessage(
      import.meta.env.VITE_API_URL + "/send-sos",
      // import.meta.env.VITE_API_URL
      zemm
    );

    setMenu(3);
  }

  return (
    <div className="fixed bottom-0 w-full max-w-[25vw] flex flex-col items-center justify-center text-orange-500 font-bold bg-white z-10 px-8 py-4 rounded-t-4xl transition-all duration-300 ease-in-out">
      {menuState === 0 && (
        <div className="px-6 py-3 space-y-3">
          <div>Galawin ang pin patungo sa iyong kasalukuyang lokasyon</div>
          <div className="flex justify-center bg-orange-600 text-white font-bold px-4 py-2 rounded-lg">
            <button onClick={() => setMenu(1)}>Confirm Location</button>
          </div>
        </div>
      )}

      {menuState === 1 && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 text-black flex flex-col items-center w-full max-w-md mx-auto"
          >
            <div className="flex flex-col space-y-3 w-full">
              <div className="flex space-x-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: John Mark..."
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headCount"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Head Count</FormLabel>
                      <FormControl>
                        <Input placeholder="1" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Mayroon bang sugatan? Hanggang saan na ang baha?"
                        className="w-full py-12 rounded-lg border-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="w-full border-2 rounded-lg p-2"
                        onChange={handleImageUpload}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {imageBase64 && (
                <div className="mt-4">
                  <img
                    src={imageBase64}
                    alt="Uploaded preview"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="w-full">
              <Button
                type="submit"
                className="w-full bg-orange-500 font-bold py-3 text-white"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      )}

      {menuState === 3 && <SOSMessage />}
    </div>
  );
}

const SOSMessage = () => {
  const [text, setText] = useState(
    "Na-send na ang iyong SOS sa mga emergency respondents"
  );
  const audioRef = useRef(new Audio("./audio.mp3")); // Using useRef to manage audio

  useEffect(() => {
    const firstTimeout = setTimeout(() => {
      setText(
        "Paparating na ang emergency respondent. Huwag mangamba sa tunog ng alarm. Gagamitin ito upang mas mapabilis ang paghanap saiyo"
      );

      const secondTimeout = setTimeout(() => {
        window.location.reload();
      }, 5000); // Reload after 5 seconds

      return () => clearTimeout(secondTimeout);
    }, 2500); // Change text after 2.5 seconds

    // Play the audio after 5 seconds and loop it for 5 seconds
    const audio = audioRef.current;
    const audioTimeout = setTimeout(() => {
      audio.loop = true; // Loop the audio
      audio.play().catch((err) => console.error("Audio play error: ", err));

      // Stop the audio after 5 seconds (or 10 seconds depending on your choice)
      setTimeout(() => {
        audio.loop = false; // Stop looping
        audio.pause();
        audio.currentTime = 0; // Reset audio to the start
      }, 10000); // Set to 10000 for 10 seconds
    }, 1000); // Start playing after 5 seconds

    // Cleanup timeouts and audio when component unmounts
    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(audioTimeout);
      audio.pause(); // Stop the audio if the component is unmounted
    };
  }, []);

  return <h1>{text}</h1>;
};

export default Menu;
