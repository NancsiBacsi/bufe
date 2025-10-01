package hu.nancsibacsi.bufe.util;

import java.nio.ByteBuffer;
import java.util.Random;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class Enc {
	private static Random r = new Random();

	public static ByteBuffer encodeS(String orig) {
		return encodeS(orig, null);
	}

	public static ByteBuffer encodeS(String orig, String salt) {
		ByteBufferUTF origb = new ByteBufferUTF(orig.length() * 4);
		origb.putString(orig);
		origb.flip();
		return encode(origb.bb, salt);
	}

	public static String decodeS(ByteBuffer encb) {
		return decodeS(encb, null);
	}

	public static String decodeS(ByteBuffer encb, String salt) {
		ByteBufferUTF decb = new ByteBufferUTF(encb.limit());
		decb.bb.put(decode(encb, salt));
		decb.bb.flip();
		return decb.getString();
	}

	public static ByteBuffer encode(ByteBuffer ba) {
		return encode(ba, null);
	}

	public static ByteBuffer encode(ByteBuffer ba, String salt) {
		ByteBuffer ba1;
		if (salt != null)
			ba1 = encodeAES(ba, getSaltedKey(salt));
		else
			ba1 = ba;
		ByteBuffer ba2 = encodeAES(ba1, getKey());
		return shuffle(ba2);
	}

	public static ByteBuffer decode(ByteBuffer ba) {
		return decode(ba, null);
	}

	public static ByteBuffer decode(ByteBuffer ba, String salt) {
		ByteBuffer ba1 = sort(ba);
		ByteBuffer ba2 = decodeAES(ba1, getKey());
		if (salt != null)
			return decodeAES(ba2, getSaltedKey(salt));
		else
			return ba2;
	}

	private static ByteBuffer encodeAES(ByteBuffer orig, ByteBuffer key) {
		ByteBuffer ret = ByteBuffer.allocate(encodedSize(orig.limit()));
		try {
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			SecretKeySpec secretKey = new SecretKeySpec(key.array(), "AES");
			IvParameterSpec iv = new IvParameterSpec(getIV(KEY_LENGTH).array());
			cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
			cipher.doFinal(orig, ret);
			ret.flip();
		} catch (Exception e) {
			ret = null;
		}
		return ret;
	}

	private static ByteBuffer decodeAES(ByteBuffer encoded, ByteBuffer key) {
		ByteBuffer ret = ByteBuffer.allocate(encoded.limit());
		try {
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			SecretKeySpec secretKey = new SecretKeySpec(key.array(), "AES");
			IvParameterSpec iv = new IvParameterSpec(getIV(KEY_LENGTH).array());
			cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
			cipher.doFinal(encoded, ret);
			ret.flip();
		} catch (Exception e) {
			ret = null;
		}
		return ret;
	}

	private static ByteBuffer getIV(int length) {
		ByteBuffer iva = ByteBuffer.allocate(length);
		length /= 2;
		for (int i = 0; i < length; i++) {
			Double a = Math.abs(Math.sin(11 + i));
			String s = a.toString();
			short ai = (short) Integer.parseInt(s.substring(2, 7));
			iva.putShort(ai);
		}
		iva.flip();
		return iva;
	}

	private static final int KEY_LENGTH = 16;

	private static ByteBuffer getKey() {
		ByteBuffer keya = ByteBuffer.allocate(KEY_LENGTH);
		for (int i = 0; i < KEY_LENGTH / 2; i++) {
			Double a = Math.abs(Math.sin(5 + i));
			String s = a.toString();
			short si = (short) Integer.parseInt(s.substring(2, 7));
			keya.putShort(si);
		}
		keya.flip();
		return keya;
	}

	private static ByteBuffer getSaltedKey(String salt) {
		salt = (salt == null) ? "" : salt;
		ByteBuffer key = getKey();
		ByteBufferUTF saltb = new ByteBufferUTF(salt.length() * 4);
		saltb.putString(salt);
		saltb.flip();
		saltb.limit(Math.min(saltb.limit(), KEY_LENGTH / 2));
		key.put(saltb.bb);
		key.position(0);
		return key;
	}

	private static ByteBuffer shuffle(ByteBuffer ba) {
		int l = ba.limit();
		ByteBuffer ret = ByteBuffer.allocate(l);
		int step = getShuffleStep(l);
		int ii = (int) Math.floor((double) step / 3);
		for (int i = 0; i < l; i++) {
			ret.put(ii, ba.get(i));
			ii = (ii + step) % l;
		}
		ret.position(0);
		return ret;
	}

	private static ByteBuffer sort(ByteBuffer ba) {
		int l = ba.limit();
		ByteBuffer ret = ByteBuffer.allocate(l);
		int step = getShuffleStep(l);
		int ii = (int) Math.floor((double) step / 3);
		for (int i = 0; i < l; i++) {
			ret.put(i, ba.get(ii));
			ii = (ii + step) % l;
		}
		ret.position(0);
		return ret;
	}

	private static int getShuffleStep(int l) {
		if (l < 3)
			return 1;
		else {
			int step = (int) Math.floor((double) l / 3) + 1;
			while (!isRelativePrime(l, step))
				step++;
			return step;
		}
	}

	private static boolean isRelativePrime(int a, int b) {
		int divident = a;
		int divisor = b;
		int remainder = 2;
		int prevRemainder = 0;
		while (remainder > 0) {
			prevRemainder = remainder;
			remainder = divident % divisor;
			divident = divisor;
			divisor = remainder;
		}
		return prevRemainder == 1;
	}

	public static String hexDump(ByteBuffer ba) {
		StringBuffer sb = new StringBuffer();
		ba.position(0);
		int l = ba.limit();
		for (int i = 0; i < l; i++) {
			byte act = ba.get();
			sb.append(String.format("%02X", act));
		}
		ba.position(0);
		return sb.toString();
	}

	public static ByteBuffer hexStringToByteArray(String s) {
		int len = s.length();
		byte[] data = new byte[len / 2];
		for (int i = 0; i < len; i += 2) {
			data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4) + Character.digit(s.charAt(i + 1), 16));
		}
		return ByteBuffer.wrap(data);
	}

	private static int encodedSize(int origSize) {
		return (origSize / 16 + 1) * 16;
	}

	public static String getRandomHex() {
		return getRandomHex(32);
	}

	public static String getRandomHex(int len) {
		StringBuffer sb = new StringBuffer();
		while (sb.length() < len)
			sb.append(Integer.toHexString(r.nextInt()));
		return sb.substring(0, len).toString();
	}
}