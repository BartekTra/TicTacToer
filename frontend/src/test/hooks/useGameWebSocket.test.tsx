import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameWebSocket } from "../../hooks/useGameWebSocket";
import { consumer } from "../../cableConsumer";

// Mock cableConsumer completely
vi.mock("../../cableConsumer", () => ({
  consumer: {
    subscriptions: {
      create: vi.fn(),
    },
  },
}));

describe("useGameWebSocket", () => {
  let mockCreate: ReturnType<typeof vi.fn>;
  let mockUnsubscribe: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    vi.useFakeTimers();
    mockUnsubscribe = vi.fn();
    mockCreate = vi.fn().mockReturnValue({
      unsubscribe: mockUnsubscribe,
    });
    
    (consumer.subscriptions.create as unknown as ReturnType<typeof vi.fn>) = mockCreate;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("does not connect if gameId is undefined", () => {
    renderHook(() => useGameWebSocket(undefined));
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("connects to GamesChannel with provided gameId", () => {
    renderHook(() => useGameWebSocket("123"));
    expect(mockCreate).toHaveBeenCalledWith(
      { channel: "GamesChannel", id: "123" },
      expect.any(Object)
    );
  });

  it("sets connectionError on disconnected/rejected", () => {
    const { result } = renderHook(() => useGameWebSocket("123"));
    const callbacks = mockCreate.mock.calls[0][1];

    act(() => {
      callbacks.disconnected();
    });
    expect(result.current.connectionError).toBe("Utracono połączenie z serwerem");

    act(() => {
      callbacks.rejected();
    });
    expect(result.current.connectionError).toBe("Brak dostępu do tej gry");

    act(() => {
      callbacks.connected();
    });
    expect(result.current.connectionError).toBeNull();
  });

  it("receives board updates", () => {
    const { result } = renderHook(() => useGameWebSocket("123"));
    const callbacks = mockCreate.mock.calls[0][1];

    const mockData = { board: "XXO------", gameMode: "classic" };
    
    act(() => {
      callbacks.received(mockData);
    });

    expect(result.current.gameData).toEqual(mockData);
  });

  it("handles game finished scenario with countdown and unsubscribe", () => {
    const { result } = renderHook(() => useGameWebSocket("123"));
    const callbacks = mockCreate.mock.calls[0][1];

    const mockFinishData = { action: "Game Finished", board: "XXX------", gameMode: "classic" };

    act(() => {
      callbacks.received(mockFinishData);
    });

    expect(result.current.gameData).toEqual(mockFinishData);
    expect(result.current.isGameFinished).toBe(false);
    expect(result.current.isGameFinished).toBe(true);
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("unsubscribes on unmount", () => {
    const { unmount } = renderHook(() => useGameWebSocket("123"));
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
