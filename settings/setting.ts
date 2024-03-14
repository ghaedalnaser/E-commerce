export const apiPort = 3000;
export const apiURL = `http://localhost:${apiPort}`;
export const settings = {
  postgres: {
    user: "postgres",
    host: "localhost",
    database: "E_commerce",
    port: 5432,
    password: "09926054832001",
  },
  jwtSecret:'Z9xHj0ME3UpZg6nzw6rU2zurvy3Z49G4fhGwTWw5QNJKprGIQr1cX+aCv1u2t9MaO01omwVs4gfvR/vFxcSbX7FUibvpiChcTkjqhXsmWKR7uiyYXIOcJn5vFnxkueHQFcaFTCGp7isuQghQrfnKGgPs8DPjtI0+TikLbKvRiMkVHXc/LL8rQTWDptjdCuVnR6L3oIxCUDhSNZKrueUiyUz4wGZyYRyZsyKxTY4KAGpv2fxO8ywVlDCOE29RWF0v10TeUcrMpVxiGpLZuAl64I7mhnwm1WG5GwxTNgGUkdtkA0GmfcEGEOd/RvVTiD1y1CAaRg1q9fcY2bv/oAhYwA==',
  jwtTokenLifeTime: '100',
	VerificationEmailPeriod: 3,
};
