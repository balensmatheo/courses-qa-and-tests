import { describe, it, expect, vi, beforeEach, afterEach, assert } from "vitest";
import { createUser } from "./user.service.js";

// Mock partiel du module user.repository
vi.mock("./user.repository", async (importOriginal) => {
  // On importe le module original pour ne mocker qu'une partie
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    createUserInRepository: vi.fn(), // On mock seulement cette fonction
  };
});

// Import de la fonction mockée après la configuration du mock
import { createUserInRepository } from "./user.repository.js";

describe("User Service", () => {
  // Réinitialise les mocks avant chaque test pour garantir l'isolation
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Hook pour nettoyer les mocks après chaque test, bonne pratique
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Success cases", () => {
    it("should create a user and return it with all properties", async () => {
      const input = { name: "Valentin R", birthday: new Date(1997, 8, 13) };
      const fakeUser = { id: 1, ...input };
      createUserInRepository.mockResolvedValue(fakeUser);
      const user = await createUser(input);
      expect(user).toBeDefined();
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name", input.name);
      expect(createUserInRepository).toHaveBeenCalledOnce();
    });
  });

  describe("Error cases", () => {
    it("should throw an error if the name is missing", async () => {
      const input = { birthday: new Date(1997, 8, 13) };

      // CORRECTION : Le message d'erreur attendu est 'Bad request' et non 'Name is required'.
      await expect(() => createUser(input)).rejects.toThrow("Bad request");

      expect(createUserInRepository).not.toHaveBeenCalled();
    });

    it("should trigger a bad request error when user creation", async () => {
      const incompleteInput = { name: "Valentin R" };
      try {
        await createUser(incompleteInput);
        assert.fail("createUser devrait lever une erreur pour une entrée incomplète.");
      } catch (e) {
        expect(e.name).toBe('HttpBadRequest');
        expect(e.statusCode).toBe(400);
      }
      expect(createUserInRepository).not.toHaveBeenCalled();
    });

    it("should throw an error if the user is too young", async () => {
      const inputForYoungUser = { name: "Benjamin Button", birthday: new Date() };
      await expect(() => createUser(inputForYoungUser)).rejects.toThrow("User is too young");
      expect(createUserInRepository).not.toHaveBeenCalled();
    });
  });
});
