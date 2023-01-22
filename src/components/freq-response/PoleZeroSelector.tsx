import React, { useState, Fragment, useEffect } from "react";
import { z } from "zod";
import { Dialog, Transition } from "@headlessui/react";

type ComplexNumber = [number, number];

interface FreqResponseConfig {
  poles: ComplexNumber[];
  zeros: ComplexNumber[];
}

const FreqResponseConfigSchema = z.object({
  poles: z.array(z.tuple([z.number(), z.number()])),
  zeros: z.array(z.tuple([z.number(), z.number()])),
});

const GetDefaultConfig = (config: any): FreqResponseConfig => {
  try {
    const parsed = FreqResponseConfigSchema.parse(config);
    console.log(parsed);
    return parsed;
  } catch (e) {
    console.error(e);
    return {
      poles: [],
      zeros: [],
    };
  }
};

const PoleZeroSelector = () => {
  const [freqResponseConfig, setFreqResponseConfig] =
    useState<FreqResponseConfig>({
      poles: [],
      zeros: [],
    });

  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const config = JSON.parse(urlSearchParams.get("config") || "{}");

    setFreqResponseConfig(GetDefaultConfig(config));
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="grid w-full place-items-center">
        <button
          className="w-96 my-3 hover:scale-105 transition-transform"
          onClick={openModal}
        >
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-b-800 border-2 border-gray-800 p-2 shadow-lg sm:p-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex w-0 flex-1 items-center">
                  <span className="flex rounded-lg bg-b-900 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      {" "}
                      <path
                        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                        fill="white"
                      ></path>{" "}
                    </svg>
                  </span>
                  <p className="ml-3 font-medium text-white">
                    Add/Edit Poles and Zeros
                  </p>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-b-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="mt-2">
                    {freqResponseConfig.poles.length > 0 && (
                      <>
                        <h1 className="text-xl font-bold text-gray-200">
                          Poles
                        </h1>
                        <hr className="my-1 border-gray-700 opacity-80" />
                      </>
                    )}
                    {freqResponseConfig.poles.map((pole, index) => (
                      <div
                        className="flex flex-row gap-3 items-center my-2"
                        key={index}
                      >
                        <p>Mag</p>

                        <input
                          type="number"
                          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                          value={pole[0]}
                          max={1}
                          min={0}
                          step={0.01}
                          onChange={(e) => {
                            setFreqResponseConfig((prev) => {
                              const newPoles = [...prev.poles];
                              newPoles[index][0] = parseFloat(e.target.value);
                              return {
                                ...prev,
                                poles: newPoles,
                              };
                            });
                          }}
                        />
                        <p>Phase (Deg)</p>

                        <input
                          type="number"
                          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                          value={pole[1]}
                          max={360}
                          min={-360}
                          step={1}
                          onChange={(e) => {
                            setFreqResponseConfig((prev) => {
                              const newPoles = [...prev.poles];
                              newPoles[index][1] = parseFloat(e.target.value);
                              return {
                                ...prev,
                                poles: newPoles,
                              };
                            });
                          }}
                        />

                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium  hover:bg-red-600 "
                          onClick={() => {
                            setFreqResponseConfig((prev) => {
                              const newPoles = [...prev.poles];
                              newPoles.splice(index, 1);
                              return {
                                ...prev,
                                poles: newPoles,
                              };
                            });
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                    {freqResponseConfig.zeros.length > 0 && (
                      <>
                        <h1 className="text-xl font-bold text-gray-200">
                          Zeros
                        </h1>
                        <hr className="my-1 border-gray-700 opacity-80" />
                      </>
                    )}

                    {freqResponseConfig.zeros.map((zero, index) => (
                      <div
                        className="flex flex-row gap-3 items-center my-2"
                        key={index}
                      >
                        <p>Mag</p>

                        <input
                          type="number"
                          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                          value={zero[0]}
                          max={1}
                          min={0}
                          step={0.01}
                          onChange={(e) => {
                            setFreqResponseConfig((prev) => {
                              const newPoles = [...prev.zeros];
                              newPoles[index][0] = parseFloat(e.target.value);
                              return {
                                ...prev,
                                zeros: newPoles,
                              };
                            });
                          }}
                        />
                        <p>Phase (Deg)</p>

                        <input
                          type="number"
                          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                          value={zero[1]}
                          max={360}
                          min={-360}
                          step={1}
                          onChange={(e) => {
                            setFreqResponseConfig((prev) => {
                              const newPoles = [...prev.zeros];
                              newPoles[index][1] = parseFloat(e.target.value);
                              return {
                                ...prev,
                                zeros: newPoles,
                              };
                            });
                          }}
                        />

                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium  hover:bg-red-600 "
                          onClick={() => {
                            setFreqResponseConfig((prev) => {
                              const newPoles = [...prev.zeros];
                              newPoles.splice(index, 1);
                              return {
                                ...prev,
                                zeros: newPoles,
                              };
                            });
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-row gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-cyan-500 px-4 py-2 text-sm font-medium  hover:bg-cyan-600 "
                      onClick={() => {
                        setFreqResponseConfig((prev) => ({
                          ...prev,
                          poles: [...prev.poles, [0, 0]],
                        }));
                        console.log(freqResponseConfig);
                      }}
                    >
                      Add Pole
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium  hover:bg-orange-600 "
                      onClick={() => {
                        setFreqResponseConfig((prev) => ({
                          ...prev,
                          zeros: [...prev.zeros, [0, 0]],
                        }));
                      }}
                    >
                      Add Zero
                    </button>
                    <button
                      type="button"
                      className="inline-flex 
					  justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium  hover:bg-slate-900 "
                      onClick={() => {
                        // reoute to /freq-response?config=...
                        window.location.href = `/freq-response?config=${JSON.stringify(
                          freqResponseConfig
                        )}`;
                      }}
                    >
                      Update
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PoleZeroSelector;
