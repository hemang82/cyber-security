"use client";

import { useState, useCallback } from "react";

// export const useModal = (initialState: boolean = false) => {
//   const [isOpen, setIsOpen] = useState(initialState);
//   const [modelData, setModelData] = useState({});


//   const openModal = useCallback(() => setIsOpen(true), []);
//   const closeModal = useCallback(() => setIsOpen(false), []);
//   const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);
//   const setModelDataFunc = useCallback(() => setModelData(false), []);

//   return { isOpen, openModal, closeModal, toggleModal };
// };


export const useModal = <T = any>(initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState<T | null>(null);

  const openModal = useCallback((data?: T) => {
    if (data) {
      setModalData(data);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal,
    setModalData,
  };
};
