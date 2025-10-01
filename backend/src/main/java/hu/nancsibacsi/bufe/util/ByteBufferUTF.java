package hu.nancsibacsi.bufe.util;

import java.io.UnsupportedEncodingException;
import java.nio.BufferUnderflowException;
import java.nio.ByteBuffer;

public class ByteBufferUTF {
	public ByteBuffer bb;

	public ByteBufferUTF(int capacity) {
		bb = ByteBuffer.allocate(capacity);
	}

	public ByteBufferUTF(ByteBuffer bb) {
		this.bb = bb;
	}

	public void compact() {
		bb.compact();
	}

	public byte get() {
		return bb.get();
	}

	public byte get(int index) {
		return bb.get(index);
	}

	public void get(byte[] dst) {
		bb.get(dst);
	}

	public void get(byte[] dst, int offset, int length) {
		bb.get(dst, offset, length);
	}

	public double getDouble() {
		return bb.getDouble();
	}

	public double getDouble(int index) {
		return bb.getDouble(index);
	}

	public int getInt() {
		return bb.getInt();
	}

	public int getInt(int index) {
		return bb.getInt(index);
	}

	public short getShort() {
		return bb.getShort();
	}

	public short getShort(int index) {
		return bb.getShort(index);
	}

	public int hashCode() {
		return bb.hashCode();
	}

	public void put(byte b) {
		bb.put(b);
	}

	public void put(ByteBufferUTF src) {
		bb.put(src.bb);
	}

	public void put(int index, byte b) {
		bb.put(index, b);
	}

	public void put(byte[] src) {
		bb.put(src);
	}

	public void put(byte[] src, int offset, int length) {
		bb.put(src, offset, length);
	}

	public void putDouble(double value) {
		bb.putDouble(value);
	}

	public void putDouble(int index, double value) {
		bb.putDouble(index, value);
	}

	public void putInt(int value) {
		bb.putInt(value);
	}

	public void putInt(int index, int value) {
		bb.putInt(index, value);
	}

	public void putShort(short value) {
		bb.putShort(value);
	}

	public void putShort(int index, short value) {
		bb.putShort(index, value);
	}

	public String toString() {
		return bb.toString();
	}

	public int capacity() {
		return bb.capacity();
	}

	public void clear() {
		bb.clear();
	}

	public void flip() {
		bb.flip();
	}

	public boolean hasRemaining() {
		return bb.hasRemaining();
	}

	public int limit() {
		return bb.limit();
	}

	public void limit(int newLimit) {
		bb.limit(newLimit);
	}

	public int position() {
		return bb.position();
	}

	public void position(int newPosition) {
		bb.position(newPosition);
	}

	public int remaining() {
		return bb.remaining();
	}

	public void reset() {
		bb.reset();
	}

	public void rewind() {
		bb.rewind();
	}

	public String getString() {
		String ret = null;
		int len = remaining();
		byte[] ba = new byte[len];
		get(ba, 0, (int) len);
		try {
			ret = new String(ba, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			// Bad encoding - returns null
		}
		return ret;
	}

	public String getStringWithSize() throws BufferUnderflowException {
		if (remaining() >= 2) {
			short len = getShort();
			if (remaining() >= len) {
				String ret = null;
				byte[] ba = new byte[len];
				get(ba, 0, (int) len);
				try {
					ret = new String(ba, "UTF-8");
				} catch (UnsupportedEncodingException e) {
					// Bad encoding - returns null
				}
				return ret;
			} else
				throw new BufferUnderflowException();
		} else
			throw new BufferUnderflowException();
	}

	public void putString(String s) {
		byte[] sb = null;
		try {
			sb = s.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			// Bad encoding - returns null
		}
		put(sb);
	}

	public void putStringWithSize(String s) {
		byte[] sb = null;
		try {
			sb = s.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			// Bad encoding - returns null
		}
		putShort((short) sb.length);
		put(sb);
	}
}