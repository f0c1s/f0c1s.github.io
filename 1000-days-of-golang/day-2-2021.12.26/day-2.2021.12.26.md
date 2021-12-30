<html lang="en">
    <head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>blog.f0c1s.com/1000-days-of-golang/day 2</title>
    <script src="../../setup.js" async></script>
    <link rel="stylesheet" href="../../index.css" />
    <link rel="stylesheet" href="../../highlight/styles/monokai.min.css"/>
    <script src="../../highlight/highlight.min.js"></script>

    </head>

<body onload="setup()">
<h1>/f0c1s/blog/1000-days-of-golang/Day 2</h1>

2021.12.26 Sunday

<p>
    <a href="../../index.html">blog</a>
    <a href="../../1000-days-of-golang/1000-days-of-golang.html">1000-days-of-golang</a>
    <a href="../../1000-days-of-golang/day-2-2021.12.26/day-2.2021.12.26.html">+ Day 2 of 1000 days of golang 2021.12.26 Sunday</a>
</p>

## lets go

### recap.

- Able to print hello world.
- Ended up using constant and function hoisting (of sorts, JS term, doesn't really translate exactly for Go.)
- Printed a function pointer, without specifying type or size. When I say pointer, I mean just the address via name.
  - Because names are pointing to an object in memory.
- Read code for Fprintln and Println.

## writing our own println and fprintln function

If we copy the body of the functions, and create new functions, it still will work.

This shows that language is truly open sourced, 

and that if you implement correct interfaces correctly, it will just work perfectly.

### Println - our-print.go

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	printNewLine("what are you doing step-coder")
	printNewLine(printNewLine)
}

// a copy of Println
func printNewLine(a ...interface{}) (n int, err error) {
	return fmt.Fprintln(os.Stdout, a...)
}

```

```shell
go run our-print.go   
what are you doing step-coder
0x47e320

```

Questions here...

1. What is interface? (here, and in Go)
2. What is `...`? It looks like a rest operator from JS.

### Fprintln - our-fprint.go

Oh boy, it was a rabit hole. 

In the end, I didn't want to copy (and keep) `fmtSort` and couldn't find what I should do with `reflect.Pointer`.

I started with first line of Fprinln and kept adding code, until all the missing pieces were found. Again, fmtSort and reflect.Pointer remain. 

The files I needed to copy from were print.go and format.go.

- [source print.go](https://github.com/golang/go/blob/master/src/fmt/print.go)
- [source format.go](https://github.com/golang/go/blob/master/src/fmt/format.go)


```go
package main

import (
	"1000-days-day-2/fmtsort"
	"io"
	"reflect"
	"strconv"
	"sync"
	"unicode/utf8"
)

func main() {

}

// flags placed in a separate struct for easy clearing.
type fmtFlags struct {
	widPresent  bool
	precPresent bool
	minus       bool
	plus        bool
	sharp       bool
	space       bool
	zero        bool

	// For the formats %+v %#v, we set the plusV/sharpV flags
	// and clear the plus/sharp flags since %+v and %#v are in effect
	// different, flagless formats set at the top level.
	plusV  bool
	sharpV bool
}

// Use simple []byte instead of bytes.Buffer to avoid large dependency.
type buffer []byte

// A fmt is the raw formatter used by Printf etc.
// It prints into a buffer that must be set up separately.
type fmt struct {
	buf *buffer

	fmtFlags

	wid  int // width
	prec int // precision

	// intbuf is large enough to store %b of an int64 with a sign and
	// avoids padding at the end of the struct on 32 bit architectures.
	intbuf [68]byte
}

func (f *fmt) clearflags() {
	f.fmtFlags = fmtFlags{}
}

func (f *fmt) init(buf *buffer) {
	f.buf = buf
	f.clearflags()
}

type pp struct {
	buf buffer

	// arg holds the current item, as an interface{}.
	arg interface{}

	// value is used instead of arg for reflect values.
	value reflect.Value

	// fmt is used to format basic items such as integers or strings.
	fmt fmt

	// reordered records whether the format string used argument reordering.
	reordered bool
	// goodArgNum records whether the most recent reordering directive was valid.
	goodArgNum bool
	// panicking is set by catchPanic to avoid infinite panic, recover, panic, ... recursion.
	panicking bool
	// erroring is set when printing an error string to guard against calling handleMethods.
	erroring bool
	// wrapErrs is set when the format string may contain a %w verb.
	wrapErrs bool
	// wrappedErr records the target of the %w verb.
	wrappedErr error
}

var ppFree = sync.Pool{
	New: func() interface{} { return new(pp) },
}

func newPrinter() *pp {
	p := ppFree.Get().(*pp)
	p.panicking = false
	p.erroring = false
	p.wrapErrs = false
	p.fmt.init(&p.buf)
	return p
}

func (b *buffer) writeByte(c byte) {
	*b = append(*b, c)
}
func (b *buffer) writeString(s string) {
	*b = append(*b, s...)
}

// padString appends s to f.buf, padded on left (!f.minus) or right (f.minus).
func (f *fmt) padString(s string) {
	if !f.widPresent || f.wid == 0 {
		f.buf.writeString(s)
		return
	}
	width := f.wid - utf8.RuneCountInString(s)
	if !f.minus {
		// left padding
		f.writePadding(width)
		f.buf.writeString(s)
	} else {
		// right padding
		f.buf.writeString(s)
		f.writePadding(width)
	}
}

// writePadding generates n bytes of padding.
func (f *fmt) writePadding(n int) {
	if n <= 0 { // No padding bytes needed.
		return
	}
	buf := *f.buf
	oldLen := len(buf)
	newLen := oldLen + n
	// Make enough room for padding.
	if newLen > cap(buf) {
		buf = make(buffer, cap(buf)*2+n)
		copy(buf, *f.buf)
	}
	// Decide which byte the padding should be filled with.
	padByte := byte(' ')
	if f.zero {
		padByte = byte('0')
	}
	// Fill padding with padByte.
	padding := buf[oldLen:newLen]
	for i := range padding {
		padding[i] = padByte
	}
	*f.buf = buf[:newLen]
}

// Strings for use with buffer.WriteString.
// This is less overhead than using buffer.Write with byte arrays.
const (
	commaSpaceString  = ", "
	nilAngleString    = "<nil>"
	nilParenString    = "(nil)"
	nilString         = "nil"
	mapString         = "map["
	percentBangString = "%!"
	missingString     = "(MISSING)"
	badIndexString    = "(BADINDEX)"
	panicString       = "(PANIC="
	extraString       = "%!(EXTRA "
	badWidthString    = "%!(BADWIDTH)"
	badPrecString     = "%!(BADPREC)"
	noVerbString      = "%!(NOVERB)"
	invReflectString  = "<invalid reflect.Value>"
)

func (bp *buffer) writeRune(r rune) {
	if r < utf8.RuneSelf {
		*bp = append(*bp, byte(r))
		return
	}

	b := *bp
	n := len(b)
	for n+utf8.UTFMax > cap(b) {
		b = append(b, 0)
	}
	w := utf8.EncodeRune(b[n:n+utf8.UTFMax], r)
	*bp = b[:n+w]
}
func (p *pp) badVerb(verb rune) {
	p.erroring = true
	p.buf.writeString(percentBangString)
	p.buf.writeRune(verb)
	p.buf.writeByte('(')
	switch {
	case p.arg != nil:
		p.buf.writeString(reflect.TypeOf(p.arg).String())
		p.buf.writeByte('=')
		p.printArg(p.arg, 'v')
	case p.value.IsValid():
		p.buf.writeString(p.value.Type().String())
		p.buf.writeByte('=')
		p.printValue(p.value, 'v', 0)
	default:
		p.buf.writeString(nilAngleString)
	}
	p.buf.writeByte(')')
	p.erroring = false
}

// truncateString truncates the string s to the specified precision, if present.
func (f *fmt) truncateString(s string) string {
	if f.precPresent {
		n := f.prec
		for i := range s {
			n--
			if n < 0 {
				return s[:i]
			}
		}
	}
	return s
}

// fmtS formats a string.
func (f *fmt) fmtS(s string) {
	s = f.truncateString(s)
	f.padString(s)
}

func (b *buffer) write(p []byte) {
	*b = append(*b, p...)
}

// pad appends b to f.buf, padded on left (!f.minus) or right (f.minus).
func (f *fmt) pad(b []byte) {
	if !f.widPresent || f.wid == 0 {
		f.buf.write(b)
		return
	}
	width := f.wid - utf8.RuneCount(b)
	if !f.minus {
		// left padding
		f.writePadding(width)
		f.buf.write(b)
	} else {
		// right padding
		f.buf.write(b)
		f.writePadding(width)
	}
}

// fmtInteger formats signed and unsigned integers.
func (f *fmt) fmtInteger(u uint64, base int, isSigned bool, verb rune, digits string) {
	negative := isSigned && int64(u) < 0
	if negative {
		u = -u
	}

	buf := f.intbuf[0:]
	// The already allocated f.intbuf with a capacity of 68 bytes
	// is large enough for integer formatting when no precision or width is set.
	if f.widPresent || f.precPresent {
		// Account 3 extra bytes for possible addition of a sign and "0x".
		width := 3 + f.wid + f.prec // wid and prec are always positive.
		if width > len(buf) {
			// We're going to need a bigger boat.
			buf = make([]byte, width)
		}
	}

	// Two ways to ask for extra leading zero digits: %.3d or %03d.
	// If both are specified the f.zero flag is ignored and
	// padding with spaces is used instead.
	prec := 0
	if f.precPresent {
		prec = f.prec
		// Precision of 0 and value of 0 means "print nothing" but padding.
		if prec == 0 && u == 0 {
			oldZero := f.zero
			f.zero = false
			f.writePadding(f.wid)
			f.zero = oldZero
			return
		}
	} else if f.zero && f.widPresent {
		prec = f.wid
		if negative || f.plus || f.space {
			prec-- // leave room for sign
		}
	}

	// Because printing is easier right-to-left: format u into buf, ending at buf[i].
	// We could make things marginally faster by splitting the 32-bit case out
	// into a separate block but it's not worth the duplication, so u has 64 bits.
	i := len(buf)
	// Use constants for the division and modulo for more efficient code.
	// Switch cases ordered by popularity.
	switch base {
	case 10:
		for u >= 10 {
			i--
			next := u / 10
			buf[i] = byte('0' + u - next*10)
			u = next
		}
	case 16:
		for u >= 16 {
			i--
			buf[i] = digits[u&0xF]
			u >>= 4
		}
	case 8:
		for u >= 8 {
			i--
			buf[i] = byte('0' + u&7)
			u >>= 3
		}
	case 2:
		for u >= 2 {
			i--
			buf[i] = byte('0' + u&1)
			u >>= 1
		}
	default:
		panic("fmt: unknown base; can't happen")
	}
	i--
	buf[i] = digits[u]
	for i > 0 && prec > len(buf)-i {
		i--
		buf[i] = '0'
	}

	// Various prefixes: 0x, -, etc.
	if f.sharp {
		switch base {
		case 2:
			// Add a leading 0b.
			i--
			buf[i] = 'b'
			i--
			buf[i] = '0'
		case 8:
			if buf[i] != '0' {
				i--
				buf[i] = '0'
			}
		case 16:
			// Add a leading 0x or 0X.
			i--
			buf[i] = digits[16]
			i--
			buf[i] = '0'
		}
	}
	if verb == 'O' {
		i--
		buf[i] = 'o'
		i--
		buf[i] = '0'
	}

	if negative {
		i--
		buf[i] = '-'
	} else if f.plus {
		i--
		buf[i] = '+'
	} else if f.space {
		i--
		buf[i] = ' '
	}

	// Left padding with zeros has already been handled like precision earlier
	// or the f.zero flag is ignored due to an explicitly set precision.
	oldZero := f.zero
	f.zero = false
	f.pad(buf[i:])
	f.zero = oldZero
}

const (
	signed   = true
	unsigned = false
)

const (
	ldigits = "0123456789abcdefx"
	udigits = "0123456789ABCDEFX"
)

// fmt0x64 formats a uint64 in hexadecimal and prefixes it with 0x or
// not, as requested, by temporarily setting the sharp flag.
func (p *pp) fmt0x64(v uint64, leading0x bool) {
	sharp := p.fmt.sharp
	p.fmt.sharp = leading0x
	p.fmt.fmtInteger(v, 16, unsigned, 'v', ldigits)
	p.fmt.sharp = sharp
}

// fmtC formats an integer as a Unicode character.
// If the character is not valid Unicode, it will print '\ufffd'.
func (f *fmt) fmtC(c uint64) {
	r := rune(c)
	if c > utf8.MaxRune {
		r = utf8.RuneError
	}
	buf := f.intbuf[:0]
	w := utf8.EncodeRune(buf[:utf8.UTFMax], r)
	f.pad(buf[:w])
}

// fmtQc formats an integer as a single-quoted, escaped Go character constant.
// If the character is not valid Unicode, it will print '\ufffd'.
func (f *fmt) fmtQc(c uint64) {
	r := rune(c)
	if c > utf8.MaxRune {
		r = utf8.RuneError
	}
	buf := f.intbuf[:0]
	if f.plus {
		f.pad(strconv.AppendQuoteRuneToASCII(buf, r))
	} else {
		f.pad(strconv.AppendQuoteRune(buf, r))
	}
}

// fmtUnicode formats a uint64 as "U+0078" or with f.sharp set as "U+0078 'x'".
func (f *fmt) fmtUnicode(u uint64) {
	buf := f.intbuf[0:]

	// With default precision set the maximum needed buf length is 18
	// for formatting -1 with %#U ("U+FFFFFFFFFFFFFFFF") which fits
	// into the already allocated intbuf with a capacity of 68 bytes.
	prec := 4
	if f.precPresent && f.prec > 4 {
		prec = f.prec
		// Compute space needed for "U+" , number, " '", character, "'".
		width := 2 + prec + 2 + utf8.UTFMax + 1
		if width > len(buf) {
			buf = make([]byte, width)
		}
	}

	// Format into buf, ending at buf[i]. Formatting numbers is easier right-to-left.
	i := len(buf)

	// For %#U we want to add a space and a quoted character at the end of the buffer.
	if f.sharp && u <= utf8.MaxRune && strconv.IsPrint(rune(u)) {
		i--
		buf[i] = '\''
		i -= utf8.RuneLen(rune(u))
		utf8.EncodeRune(buf[i:], rune(u))
		i--
		buf[i] = '\''
		i--
		buf[i] = ' '
	}
	// Format the Unicode code point u as a hexadecimal number.
	for u >= 16 {
		i--
		buf[i] = udigits[u&0xF]
		prec--
		u >>= 4
	}
	i--
	buf[i] = udigits[u]
	prec--
	// Add zeros in front of the number until requested precision is reached.
	for prec > 0 {
		i--
		buf[i] = '0'
		prec--
	}
	// Add a leading "U+".
	i--
	buf[i] = '+'
	i--
	buf[i] = 'U'

	oldZero := f.zero
	f.zero = false
	f.pad(buf[i:])
	f.zero = oldZero
}

// fmtInteger formats a signed or unsigned integer.
func (p *pp) fmtInteger(v uint64, isSigned bool, verb rune) {
	switch verb {
	case 'v':
		if p.fmt.sharpV && !isSigned {
			p.fmt0x64(v, true)
		} else {
			p.fmt.fmtInteger(v, 10, isSigned, verb, ldigits)
		}
	case 'd':
		p.fmt.fmtInteger(v, 10, isSigned, verb, ldigits)
	case 'b':
		p.fmt.fmtInteger(v, 2, isSigned, verb, ldigits)
	case 'o', 'O':
		p.fmt.fmtInteger(v, 8, isSigned, verb, ldigits)
	case 'x':
		p.fmt.fmtInteger(v, 16, isSigned, verb, ldigits)
	case 'X':
		p.fmt.fmtInteger(v, 16, isSigned, verb, udigits)
	case 'c':
		p.fmt.fmtC(v)
	case 'q':
		p.fmt.fmtQc(v)
	case 'U':
		p.fmt.fmtUnicode(v)
	default:
		p.badVerb(verb)
	}
}

func (p *pp) fmtPointer(value reflect.Value, verb rune) {
	var u uintptr
	switch value.Kind() {
	case reflect.Chan, reflect.Func, reflect.Map, reflect.Pointer, reflect.Slice, reflect.UnsafePointer:
		u = value.Pointer()
	default:
		p.badVerb(verb)
		return
	}

	switch verb {
	case 'v':
		if p.fmt.sharpV {
			p.buf.writeByte('(')
			p.buf.writeString(value.Type().String())
			p.buf.writeString(")(")
			if u == 0 {
				p.buf.writeString(nilString)
			} else {
				p.fmt0x64(uint64(u), true)
			}
			p.buf.writeByte(')')
		} else {
			if u == 0 {
				p.fmt.padString(nilAngleString)
			} else {
				p.fmt0x64(uint64(u), !p.fmt.sharp)
			}
		}
	case 'p':
		p.fmt0x64(uint64(u), !p.fmt.sharp)
	case 'b', 'o', 'd', 'x', 'X':
		p.fmtInteger(uint64(u), unsigned, verb)
	default:
		p.badVerb(verb)
	}
}

// fmtBoolean formats a boolean.
func (f *fmt) fmtBoolean(v bool) {
	if v {
		f.padString("true")
	} else {
		f.padString("false")
	}
}

func (p *pp) fmtBool(v bool, verb rune) {
	switch verb {
	case 't', 'v':
		p.fmt.fmtBoolean(v)
	default:
		p.badVerb(verb)
	}
}

// fmtFloat formats a float64. It assumes that verb is a valid format specifier
// for strconv.AppendFloat and therefore fits into a byte.
func (f *fmt) fmtFloat(v float64, size int, verb rune, prec int) {
	// Explicit precision in format specifier overrules default precision.
	if f.precPresent {
		prec = f.prec
	}
	// Format number, reserving space for leading + sign if needed.
	num := strconv.AppendFloat(f.intbuf[:1], v, byte(verb), prec, size)
	if num[1] == '-' || num[1] == '+' {
		num = num[1:]
	} else {
		num[0] = '+'
	}
	// f.space means to add a leading space instead of a "+" sign unless
	// the sign is explicitly asked for by f.plus.
	if f.space && num[0] == '+' && !f.plus {
		num[0] = ' '
	}
	// Special handling for infinities and NaN,
	// which don't look like a number so shouldn't be padded with zeros.
	if num[1] == 'I' || num[1] == 'N' {
		oldZero := f.zero
		f.zero = false
		// Remove sign before NaN if not asked for.
		if num[1] == 'N' && !f.space && !f.plus {
			num = num[1:]
		}
		f.pad(num)
		f.zero = oldZero
		return
	}
	// The sharp flag forces printing a decimal point for non-binary formats
	// and retains trailing zeros, which we may need to restore.
	if f.sharp && verb != 'b' {
		digits := 0
		switch verb {
		case 'v', 'g', 'G', 'x':
			digits = prec
			// If no precision is set explicitly use a precision of 6.
			if digits == -1 {
				digits = 6
			}
		}

		// Buffer pre-allocated with enough room for
		// exponent notations of the form "e+123" or "p-1023".
		var tailBuf [6]byte
		tail := tailBuf[:0]

		hasDecimalPoint := false
		sawNonzeroDigit := false
		// Starting from i = 1 to skip sign at num[0].
		for i := 1; i < len(num); i++ {
			switch num[i] {
			case '.':
				hasDecimalPoint = true
			case 'p', 'P':
				tail = append(tail, num[i:]...)
				num = num[:i]
			case 'e', 'E':
				if verb != 'x' && verb != 'X' {
					tail = append(tail, num[i:]...)
					num = num[:i]
					break
				}
				fallthrough
			default:
				if num[i] != '0' {
					sawNonzeroDigit = true
				}
				// Count significant digits after the first non-zero digit.
				if sawNonzeroDigit {
					digits--
				}
			}
		}
		if !hasDecimalPoint {
			// Leading digit 0 should contribute once to digits.
			if len(num) == 2 && num[1] == '0' {
				digits--
			}
			num = append(num, '.')
		}
		for digits > 0 {
			num = append(num, '0')
			digits--
		}
		num = append(num, tail...)
	}
	// We want a sign if asked for and if the sign is not positive.
	if f.plus || num[0] != '+' {
		// If we're zero padding to the left we want the sign before the leading zeros.
		// Achieve this by writing the sign out and then padding the unsigned number.
		if f.zero && f.widPresent && f.wid > len(num) {
			f.buf.writeByte(num[0])
			f.writePadding(f.wid - len(num))
			f.buf.write(num[1:])
			return
		}
		f.pad(num)
		return
	}
	// No sign to show and the number is positive; just print the unsigned number.
	f.pad(num[1:])
}

// fmtFloat formats a float. The default precision for each verb
// is specified as last argument in the call to fmt_float.
func (p *pp) fmtFloat(v float64, size int, verb rune) {
	switch verb {
	case 'v':
		p.fmt.fmtFloat(v, size, 'g', -1)
	case 'b', 'g', 'G', 'x', 'X':
		p.fmt.fmtFloat(v, size, verb, -1)
	case 'f', 'e', 'E':
		p.fmt.fmtFloat(v, size, verb, 6)
	case 'F':
		p.fmt.fmtFloat(v, size, 'f', 6)
	default:
		p.badVerb(verb)
	}
}

// fmtComplex formats a complex number v with
// r = real(v) and j = imag(v) as (r+ji) using
// fmtFloat for r and j formatting.
func (p *pp) fmtComplex(v complex128, size int, verb rune) {
	// Make sure any unsupported verbs are found before the
	// calls to fmtFloat to not generate an incorrect error string.
	switch verb {
	case 'v', 'b', 'g', 'G', 'x', 'X', 'f', 'F', 'e', 'E':
		oldPlus := p.fmt.plus
		p.buf.writeByte('(')
		p.fmtFloat(real(v), size/2, verb)
		// Imaginary part always has a sign.
		p.fmt.plus = true
		p.fmtFloat(imag(v), size/2, verb)
		p.buf.writeString("i)")
		p.fmt.plus = oldPlus
	default:
		p.badVerb(verb)
	}
}

// fmtQ formats a string as a double-quoted, escaped Go string constant.
// If f.sharp is set a raw (backquoted) string may be returned instead
// if the string does not contain any control characters other than tab.
func (f *fmt) fmtQ(s string) {
	s = f.truncateString(s)
	if f.sharp && strconv.CanBackquote(s) {
		f.padString("`" + s + "`")
		return
	}
	buf := f.intbuf[:0]
	if f.plus {
		f.pad(strconv.AppendQuoteToASCII(buf, s))
	} else {
		f.pad(strconv.AppendQuote(buf, s))
	}
}

// fmtSbx formats a string or byte slice as a hexadecimal encoding of its bytes.
func (f *fmt) fmtSbx(s string, b []byte, digits string) {
	length := len(b)
	if b == nil {
		// No byte slice present. Assume string s should be encoded.
		length = len(s)
	}
	// Set length to not process more bytes than the precision demands.
	if f.precPresent && f.prec < length {
		length = f.prec
	}
	// Compute width of the encoding taking into account the f.sharp and f.space flag.
	width := 2 * length
	if width > 0 {
		if f.space {
			// Each element encoded by two hexadecimals will get a leading 0x or 0X.
			if f.sharp {
				width *= 2
			}
			// Elements will be separated by a space.
			width += length - 1
		} else if f.sharp {
			// Only a leading 0x or 0X will be added for the whole string.
			width += 2
		}
	} else { // The byte slice or string that should be encoded is empty.
		if f.widPresent {
			f.writePadding(f.wid)
		}
		return
	}
	// Handle padding to the left.
	if f.widPresent && f.wid > width && !f.minus {
		f.writePadding(f.wid - width)
	}
	// Write the encoding directly into the output buffer.
	buf := *f.buf
	if f.sharp {
		// Add leading 0x or 0X.
		buf = append(buf, '0', digits[16])
	}
	var c byte
	for i := 0; i < length; i++ {
		if f.space && i > 0 {
			// Separate elements with a space.
			buf = append(buf, ' ')
			if f.sharp {
				// Add leading 0x or 0X for each element.
				buf = append(buf, '0', digits[16])
			}
		}
		if b != nil {
			c = b[i] // Take a byte from the input byte slice.
		} else {
			c = s[i] // Take a byte from the input string.
		}
		// Encode each byte as two hexadecimal digits.
		buf = append(buf, digits[c>>4], digits[c&0xF])
	}
	*f.buf = buf
	// Handle padding to the right.
	if f.widPresent && f.wid > width && f.minus {
		f.writePadding(f.wid - width)
	}
}

// fmtSx formats a string as a hexadecimal encoding of its bytes.
func (f *fmt) fmtSx(s, digits string) {
	f.fmtSbx(s, nil, digits)
}

func (p *pp) fmtString(v string, verb rune) {
	switch verb {
	case 'v':
		if p.fmt.sharpV {
			p.fmt.fmtQ(v)
		} else {
			p.fmt.fmtS(v)
		}
	case 's':
		p.fmt.fmtS(v)
	case 'x':
		p.fmt.fmtSx(v, ldigits)
	case 'X':
		p.fmt.fmtSx(v, udigits)
	case 'q':
		p.fmt.fmtQ(v)
	default:
		p.badVerb(verb)
	}
}

// truncate truncates the byte slice b as a string of the specified precision, if present.
func (f *fmt) truncate(b []byte) []byte {
	if f.precPresent {
		n := f.prec
		for i := 0; i < len(b); {
			n--
			if n < 0 {
				return b[:i]
			}
			wid := 1
			if b[i] >= utf8.RuneSelf {
				_, wid = utf8.DecodeRune(b[i:])
			}
			i += wid
		}
	}
	return b
}

// fmtBs formats the byte slice b as if it was formatted as string with fmtS.
func (f *fmt) fmtBs(b []byte) {
	b = f.truncate(b)
	f.pad(b)
}

// fmtBx formats a byte slice as a hexadecimal encoding of its bytes.
func (f *fmt) fmtBx(b []byte, digits string) {
	f.fmtSbx("", b, digits)
}

// State represents the printer state passed to custom formatters.
// It provides access to the io.Writer interface plus information about
// the flags and options for the operand's format specifier.
type State interface {
	// Write is the function to call to emit formatted output to be printed.
	Write(b []byte) (n int, err error)
	// Width returns the value of the width option and whether it has been set.
	Width() (wid int, ok bool)
	// Precision returns the value of the precision option and whether it has been set.
	Precision() (prec int, ok bool)

	// Flag reports whether the flag c, a character, has been set.
	Flag(c int) bool
}

// Formatter is implemented by any value that has a Format method.
// The implementation controls how State and rune are interpreted,
// and may call Sprint(f) or Fprint(f) etc. to generate its output.
type Formatter interface {
	Format(f State, verb rune)
}

func (p *pp) catchPanic(arg interface{}, verb rune, method string) {
	if err := recover(); err != nil {
		// If it's a nil pointer, just say "<nil>". The likeliest causes are a
		// Stringer that fails to guard against nil or a nil pointer for a
		// value receiver, and in either case, "<nil>" is a nice result.
		if v := reflect.ValueOf(arg); v.Kind() == reflect.Pointer && v.IsNil() {
			p.buf.writeString(nilAngleString)
			return
		}
		// Otherwise print a concise panic message. Most of the time the panic
		// value will print itself nicely.
		if p.panicking {
			// Nested panics; the recursion in printArg cannot succeed.
			panic(err)
		}

		oldFlags := p.fmt.fmtFlags
		// For this output we want default behavior.
		p.fmt.clearflags()

		p.buf.writeString(percentBangString)
		p.buf.writeRune(verb)
		p.buf.writeString(panicString)
		p.buf.writeString(method)
		p.buf.writeString(" method: ")
		p.panicking = true
		p.printArg(err, 'v')
		p.panicking = false
		p.buf.writeByte(')')

		p.fmt.fmtFlags = oldFlags
	}
}

// GoStringer is implemented by any value that has a GoString method,
// which defines the Go syntax for that value.
// The GoString method is used to print values passed as an operand
// to a %#v format.
type GoStringer interface {
	GoString() string
}

// Stringer is implemented by any value that has a String method,
// which defines the ``native'' format for that value.
// The String method is used to print values passed as an operand
// to any format that accepts a string or to an unformatted printer
// such as Print.
type Stringer interface {
	String() string
}

func (p *pp) handleMethods(verb rune) (handled bool) {
	if p.erroring {
		return
	}
	if verb == 'w' {
		// It is invalid to use %w other than with Errorf, more than once,
		// or with a non-error arg.
		err, ok := p.arg.(error)
		if !ok || !p.wrapErrs || p.wrappedErr != nil {
			p.wrappedErr = nil
			p.wrapErrs = false
			p.badVerb(verb)
			return true
		}
		p.wrappedErr = err
		// If the arg is a Formatter, pass 'v' as the verb to it.
		verb = 'v'
	}

	// Is it a Formatter?
	if formatter, ok := p.arg.(Formatter); ok {
		handled = true
		defer p.catchPanic(p.arg, verb, "Format")
		formatter.Format(p, verb)
		return
	}

	// If we're doing Go syntax and the argument knows how to supply it, take care of it now.
	if p.fmt.sharpV {
		if stringer, ok := p.arg.(GoStringer); ok {
			handled = true
			defer p.catchPanic(p.arg, verb, "GoString")
			// Print the result of GoString unadorned.
			p.fmt.fmtS(stringer.GoString())
			return
		}
	} else {
		// If a string is acceptable according to the format, see if
		// the value satisfies one of the string-valued interfaces.
		// Println etc. set verb to %v, which is "stringable".
		switch verb {
		case 'v', 's', 'x', 'X', 'q':
			// Is it an error or Stringer?
			// The duplication in the bodies is necessary:
			// setting handled and deferring catchPanic
			// must happen before calling the method.
			switch v := p.arg.(type) {
			case error:
				handled = true
				defer p.catchPanic(p.arg, verb, "Error")
				p.fmtString(v.Error(), verb)
				return

			case Stringer:
				handled = true
				defer p.catchPanic(p.arg, verb, "String")
				p.fmtString(v.String(), verb)
				return
			}
		}
	}
	return false
}

// getField gets the i'th field of the struct value.
// If the field is itself is an interface, return a value for
// the thing inside the interface, not the interface itself.
func getField(v reflect.Value, i int) reflect.Value {
	val := v.Field(i)
	if val.Kind() == reflect.Interface && !val.IsNil() {
		val = val.Elem()
	}
	return val
}

func (p *pp) unknownType(v reflect.Value) {
	if !v.IsValid() {
		p.buf.writeString(nilAngleString)
		return
	}
	p.buf.writeByte('?')
	p.buf.writeString(v.Type().String())
	p.buf.writeByte('?')
}

// printValue is similar to printArg but starts with a reflect value, not an interface{} value.
// It does not handle 'p' and 'T' verbs because these should have been already handled by printArg.
func (p *pp) printValue(value reflect.Value, verb rune, depth int) {
	// Handle values with special methods if not already handled by printArg (depth == 0).
	if depth > 0 && value.IsValid() && value.CanInterface() {
		p.arg = value.Interface()
		if p.handleMethods(verb) {
			return
		}
	}
	p.arg = nil
	p.value = value

	switch f := value; value.Kind() {
	case reflect.Invalid:
		if depth == 0 {
			p.buf.writeString(invReflectString)
		} else {
			switch verb {
			case 'v':
				p.buf.writeString(nilAngleString)
			default:
				p.badVerb(verb)
			}
		}
	case reflect.Bool:
		p.fmtBool(f.Bool(), verb)
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		p.fmtInteger(uint64(f.Int()), signed, verb)
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		p.fmtInteger(f.Uint(), unsigned, verb)
	case reflect.Float32:
		p.fmtFloat(f.Float(), 32, verb)
	case reflect.Float64:
		p.fmtFloat(f.Float(), 64, verb)
	case reflect.Complex64:
		p.fmtComplex(f.Complex(), 64, verb)
	case reflect.Complex128:
		p.fmtComplex(f.Complex(), 128, verb)
	case reflect.String:
		p.fmtString(f.String(), verb)
	case reflect.Map:
		if p.fmt.sharpV {
			p.buf.writeString(f.Type().String())
			if f.IsNil() {
				p.buf.writeString(nilParenString)
				return
			}
			p.buf.writeByte('{')
		} else {
			p.buf.writeString(mapString)
		}
		sorted := fmtsort.Sort(f)
		for i, key := range sorted.Key {
			if i > 0 {
				if p.fmt.sharpV {
					p.buf.writeString(commaSpaceString)
				} else {
					p.buf.writeByte(' ')
				}
			}
			p.printValue(key, verb, depth+1)
			p.buf.writeByte(':')
			p.printValue(sorted.Value[i], verb, depth+1)
		}
		if p.fmt.sharpV {
			p.buf.writeByte('}')
		} else {
			p.buf.writeByte(']')
		}
	case reflect.Struct:
		if p.fmt.sharpV {
			p.buf.writeString(f.Type().String())
		}
		p.buf.writeByte('{')
		for i := 0; i < f.NumField(); i++ {
			if i > 0 {
				if p.fmt.sharpV {
					p.buf.writeString(commaSpaceString)
				} else {
					p.buf.writeByte(' ')
				}
			}
			if p.fmt.plusV || p.fmt.sharpV {
				if name := f.Type().Field(i).Name; name != "" {
					p.buf.writeString(name)
					p.buf.writeByte(':')
				}
			}
			p.printValue(getField(f, i), verb, depth+1)
		}
		p.buf.writeByte('}')
	case reflect.Interface:
		value := f.Elem()
		if !value.IsValid() {
			if p.fmt.sharpV {
				p.buf.writeString(f.Type().String())
				p.buf.writeString(nilParenString)
			} else {
				p.buf.writeString(nilAngleString)
			}
		} else {
			p.printValue(value, verb, depth+1)
		}
	case reflect.Array, reflect.Slice:
		switch verb {
		case 's', 'q', 'x', 'X':
			// Handle byte and uint8 slices and arrays special for the above verbs.
			t := f.Type()
			if t.Elem().Kind() == reflect.Uint8 {
				var bytes []byte
				if f.Kind() == reflect.Slice {
					bytes = f.Bytes()
				} else if f.CanAddr() {
					bytes = f.Slice(0, f.Len()).Bytes()
				} else {
					// We have an array, but we cannot Slice() a non-addressable array,
					// so we build a slice by hand. This is a rare case but it would be nice
					// if reflection could help a little more.
					bytes = make([]byte, f.Len())
					for i := range bytes {
						bytes[i] = byte(f.Index(i).Uint())
					}
				}
				p.fmtBytes(bytes, verb, t.String())
				return
			}
		}
		if p.fmt.sharpV {
			p.buf.writeString(f.Type().String())
			if f.Kind() == reflect.Slice && f.IsNil() {
				p.buf.writeString(nilParenString)
				return
			}
			p.buf.writeByte('{')
			for i := 0; i < f.Len(); i++ {
				if i > 0 {
					p.buf.writeString(commaSpaceString)
				}
				p.printValue(f.Index(i), verb, depth+1)
			}
			p.buf.writeByte('}')
		} else {
			p.buf.writeByte('[')
			for i := 0; i < f.Len(); i++ {
				if i > 0 {
					p.buf.writeByte(' ')
				}
				p.printValue(f.Index(i), verb, depth+1)
			}
			p.buf.writeByte(']')
		}
	case reflect.Pointer:
		// pointer to array or slice or struct? ok at top level
		// but not embedded (avoid loops)
		if depth == 0 && f.Pointer() != 0 {
			switch a := f.Elem(); a.Kind() {
			case reflect.Array, reflect.Slice, reflect.Struct, reflect.Map:
				p.buf.writeByte('&')
				p.printValue(a, verb, depth+1)
				return
			}
		}
		fallthrough
	case reflect.Chan, reflect.Func, reflect.UnsafePointer:
		p.fmtPointer(f, verb)
	default:
		p.unknownType(f)
	}
}

func (p *pp) fmtBytes(v []byte, verb rune, typeString string) {
	switch verb {
	case 'v', 'd':
		if p.fmt.sharpV {
			p.buf.writeString(typeString)
			if v == nil {
				p.buf.writeString(nilParenString)
				return
			}
			p.buf.writeByte('{')
			for i, c := range v {
				if i > 0 {
					p.buf.writeString(commaSpaceString)
				}
				p.fmt0x64(uint64(c), true)
			}
			p.buf.writeByte('}')
		} else {
			p.buf.writeByte('[')
			for i, c := range v {
				if i > 0 {
					p.buf.writeByte(' ')
				}
				p.fmt.fmtInteger(uint64(c), 10, unsigned, verb, ldigits)
			}
			p.buf.writeByte(']')
		}
	case 's':
		p.fmt.fmtBs(v)
	case 'x':
		p.fmt.fmtBx(v, ldigits)
	case 'X':
		p.fmt.fmtBx(v, udigits)
	case 'q':
		p.fmt.fmtQ(string(v))
	default:
		p.printValue(reflect.ValueOf(v), verb, 0)
	}
}

func (p *pp) printArg(arg interface{}, verb rune) {
	p.arg = arg
	p.value = reflect.Value{}

	if arg == nil {
		switch verb {
		case 'T', 'v':
			p.fmt.padString(nilAngleString)
		default:
			p.badVerb(verb)
		}
		return
	}

	// Special processing considerations.
	// %T (the value's type) and %p (its address) are special; we always do them first.
	switch verb {
	case 'T':
		p.fmt.fmtS(reflect.TypeOf(arg).String())
		return
	case 'p':
		p.fmtPointer(reflect.ValueOf(arg), 'p')
		return
	}

	// Some types can be done without reflection.
	switch f := arg.(type) {
	case bool:
		p.fmtBool(f, verb)
	case float32:
		p.fmtFloat(float64(f), 32, verb)
	case float64:
		p.fmtFloat(f, 64, verb)
	case complex64:
		p.fmtComplex(complex128(f), 64, verb)
	case complex128:
		p.fmtComplex(f, 128, verb)
	case int:
		p.fmtInteger(uint64(f), signed, verb)
	case int8:
		p.fmtInteger(uint64(f), signed, verb)
	case int16:
		p.fmtInteger(uint64(f), signed, verb)
	case int32:
		p.fmtInteger(uint64(f), signed, verb)
	case int64:
		p.fmtInteger(uint64(f), signed, verb)
	case uint:
		p.fmtInteger(uint64(f), unsigned, verb)
	case uint8:
		p.fmtInteger(uint64(f), unsigned, verb)
	case uint16:
		p.fmtInteger(uint64(f), unsigned, verb)
	case uint32:
		p.fmtInteger(uint64(f), unsigned, verb)
	case uint64:
		p.fmtInteger(f, unsigned, verb)
	case uintptr:
		p.fmtInteger(uint64(f), unsigned, verb)
	case string:
		p.fmtString(f, verb)
	case []byte:
		p.fmtBytes(f, verb, "[]byte")
	case reflect.Value:
		// Handle extractable values with special methods
		// since printValue does not handle them at depth 0.
		if f.IsValid() && f.CanInterface() {
			p.arg = f.Interface()
			if p.handleMethods(verb) {
				return
			}
		}
		p.printValue(f, verb, 0)
	default:
		// If the type is not simple, it might have methods.
		if !p.handleMethods(verb) {
			// Need to use reflection, since the type had no
			// interface methods that could be used for formatting.
			p.printValue(reflect.ValueOf(f), verb, 0)
		}
	}
}

// doPrintln is like doPrint but always adds a space between arguments
// and a newline after the last argument.
func (p *pp) doPrintln(a []interface{}) {
	for argNum, arg := range a {
		if argNum > 0 {
			p.buf.writeByte(' ')
		}
		p.printArg(arg, 'v')
	}
	p.buf.writeByte('\n')
}

// free saves used pp structs in ppFree; avoids an allocation per invocation.
func (p *pp) free() {
	// Proper usage of a sync.Pool requires each entry to have approximately
	// the same memory cost. To obtain this property when the stored type
	// contains a variably-sized buffer, we add a hard limit on the maximum buffer
	// to place back in the pool.
	//
	// See https://golang.org/issue/23199
	if cap(p.buf) > 64<<10 {
		return
	}

	p.buf = p.buf[:0]
	p.arg = nil
	p.value = reflect.Value{}
	p.wrappedErr = nil
	ppFree.Put(p)
}

// what started all of this
func fprintln(w io.Writer, a ...interface{}) (n int, err error) {
	p := newPrinter()
	p.doPrintln(a)
	n, err = w.Write(p.buf)
	p.free()
	return
}

```

Things learnt from this exercise

- IO has a lot of moving parts.
- any is used to mean interface{}
- go has structs
- go functions can be implemented against specific objects.
- 

### `interface{}`

- [https://stackoverflow.com/questions/59976812/empty-interfaces-in-golang](https://stackoverflow.com/questions/59976812/empty-interfaces-in-golang)
- [https://go.dev/tour/methods/14](https://go.dev/tour/methods/14)
- At runtime, any value can be assigned to the variable that is marked `interface{}`.
  - This is similar to JS, where you can assign any value to any variable at execution time.

#### empty-interface.go

```go
package main

import "fmt"

func main() {
	var i interface{}
	describe(i)

	i = 42
	describe(i)

	i = "hello"
	describe(i)
}

func describe(i interface{}) {
	fmt.Printf("(%v, %T)\n", i, i)
}
```

![1.empty-interface](1.empty-interface.png)

[https://stackoverflow.com/questions/23148812/whats-the-meaning-of-interface](https://stackoverflow.com/questions/23148812/whats-the-meaning-of-interface)

### struct

`type name struct{ }` is what creates a struct named "name".

## write some code

### echo function #1

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	echo()
}

func echo() {
	for _, arg := range os.Args[1:] {
		fmt.Println(arg)
	}
}


```


```shell
./echo-one third second first                                     
third
second
first

```

Basically we are ranging over Slice of arguments.

I do not know what a Slice is, but it feels like that it is basically a JavaScript style array, that is, it is dynamically sized.

### echo function #2

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	echo2()
}

func echo2() {
	var str, sep string
	for i := 1; i < len(os.Args); i++ {
		str += sep + os.Args[i]
		sep += " " // lol this logic... deliberate though
	}
	fmt.Println(str)
}

```

```shell
./echo-two oompa loompa goomba zumba roomba harambe bombay tomboy ohboy yayyayyay
oompa loompa  goomba   zumba    roomba     harambe      bombay       tomboy        ohboy         yayyayyay

```

![2.the-universe-is-expanding](2.the-universe-is-expanding.png)

In this function, we are dealing with the Slice in a more hands-on way, where we have to write logic for access and increment of index.

In the example #1, we were using in-build feature to do this automagically for us.

Also, note that when we say `var str, sep string` we are not providing any value to str or sep. These variables end up receiving default values.

These are called zero values in go, such as 0 for int and empty string "" for string types.

## Other interesting things in os package

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Println(os.Environ())
}

```

```shell
./env                                                                            
[PATH=/usr/lib/go-1.17/bin:/home/f0c1s/go/bin:
... so on...
```

There are bunch of things that I think I will be using soon enough...

## Reading a file in go

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	data, err := os.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}
	fmt.Println(data)
	fmt.Println(string(data))
}


```

```shell
go build read-file.go
./read-file read-file.go
[112 97 99 107 97 103 101 32 109 97 105 110 10 10 105 109 112 111 114 116 32 40 10 9 34 102 109 116 34 10 9 34 111 115 34 10 41 10 10 102 117 110 99 32 109 97 105 110 40 41 32 123 10 9 100 97 116 97 44 32 101 114 114 32 58 61 32 111 115 46 82 101 97 100 70 105 108 101 40 111 115 46 65 114 103 115 91 49 93 41 10 9 105 102 32 101 114 114 32 33 61 32 110 105 108 32 123 10 9 9 112 97 110 105 99 40 101 114 114 41 10 9 125 10 9 102 109 116 46 80 114 105 110 116 108 110 40 100 97 116 97 41 10 9 102 109 116 46 80 114 105 110 116 108 110 40 115 116 114 105 110 103 40 100 97 116 97 41 41 10 125 10]
package main

import (
        "fmt"
        "os"
)

func main() {
        data, err := os.ReadFile(os.Args[1])
        if err != nil {
                panic(err)
        }
        fmt.Println(data)
        fmt.Println(string(data))
}

```

### Reading a file and reversing the input linewise

```go
package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	fileData, err := os.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}
	fileLines := strings.Split(string(fileData), "\n")

	// only way to reverse a slice in Go: wut?
	for i, j := 0, len(fileLines)-1; i < j; i, j = i+1, j-1 {
		fileLines[i], fileLines[j] = fileLines[j], fileLines[i]
	}

	for _, line := range fileLines {
		fmt.Println(line)
	}
}

```

```shell
go build split-lines.go
./split-lines split-lines.go

}
        }
                fmt.Println(line)
        for _, line := range fileLines {

        }
                fileLines[i], fileLines[j] = fileLines[j], fileLines[i]
        for i, j := 0, len(fileLines)-1; i < j; i, j = i+1, j-1 {
        // only way to reverse a slice in Go: wut?

        fileLines := strings.Split(string(fileData), "\n")
        }
                panic(err)
        if err != nil {
        fileData, err := os.ReadFile(os.Args[1])
func main() {

)
        "strings"
        "os"
        "fmt"
import (

package main

```

#### now reverse each string too...

```go
package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	fileData, err := os.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}
	fileLines := strings.Split(string(fileData), "\n")

	// reverse the whole file, first to last, second to second-last...
	for i, j := 0, len(fileLines)-1; i < j; i, j = i+1, j-1 {
		// reverse ith line
		ith := []rune(fileLines[i])
		for k, l := 0, len(ith)-1; k < l; k, l = k+1, l-1 {
			ith[k], ith[l] = ith[l], ith[k]
		}
		// reverse jth line
		jth := []rune(fileLines[j])
		for k, l := 0, len(jth)-1; k < l; k, l = k+1, l-1 {
			jth[k], jth[l] = jth[l], jth[k]
		}
		fileLines[i], fileLines[j] = string(jth), string(ith)
	}

	for _, line := range fileLines {
		fmt.Println(line)
	}
}

```

```shell
go build reversed-lines.go
./reversed-lines reversed-lines.go

}
}       
)enil(nltnirP.tmf               
{ seniLelif egnar =: enil ,_ rof        

}       
)hti(gnirts ,)htj(gnirts = ]j[seniLelif ,]i[seniLelif           
}               
]k[htj ,]l[htj = ]l[htj ,]k[htj                 
{ 1-l ,1+k = l ,k ;l < k ;1-)htj(nel ,0 =: l ,k rof             
}               
]k[hti ,]l[hti = ]l[hti ,]k[hti                 
{ 1-l ,1+k = l ,k ;l < k ;1-)hti(nel ,0 =: l ,k rof             
)]j[seniLelif(enur][ =: htj             
)]i[seniLelif(enur][ =: hti             
        for i, j := 0, len(fileLines)-1; i < j; i, j = i+1, j-1 {
?tuw :oG ni ecils a esrever ot yaw ylno //      

)"n\" ,)ataDelif(gnirts(tilpS.sgnirts =: seniLelif      
}       
)rre(cinap              
{ lin =! rre fi 
)]1[sgrA.so(eliFdaeR.so =: rre ,ataDelif        
{ )(niam cnuf

)
"sgnirts"       
"so"    
"tmf"   
( tropmi

niam egakcap

```

- [https://www.tutorialspoint.com/write-a-golang-program-to-reverse-a-string](https://www.tutorialspoint.com/write-a-golang-program-to-reverse-a-string)
- [https://stackoverflow.com/questions/12907653/what-is-the-difference-between-string-and-string-in-golang](https://stackoverflow.com/questions/12907653/what-is-the-difference-between-string-and-string-in-golang)
- [https://stackoverflow.com/questions/19239449/how-do-i-reverse-an-array-in-go](https://stackoverflow.com/questions/19239449/how-do-i-reverse-an-array-in-go)
- [https://stackoverflow.com/questions/25080862/how-to-strings-split-on-newline](https://stackoverflow.com/questions/25080862/how-to-strings-split-on-newline)
- [https://gobyexample.com/reading-files](https://gobyexample.com/reading-files)

## Wait, there is no `reduce`, `filter`, `map` in go

What backward-ass programming language is this?

I guess system programming one.

Moving on. 

## Summing up an array

```go
package main

import "fmt"

func main() {
	arr := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	var sum = 0
	for _, val := range arr {
		sum += val
	}
	fmt.Println("And the sum is: ", sum)
}

```

It correctly prints 55.

## Scan an array

Scanning is reading a list and doing something with the current value, and getting the output as it changes with current value.

```go
arr := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	sum, avg := 0, 0
	for i, val := range arr {
		sum += val
		avg = sum / (i+1)
		fmt.Println("The sum is: ", sum, "; and average is: ", avg)
	}
```

```shell
The sum is:  1 ; and average is:  1
The sum is:  3 ; and average is:  1
The sum is:  6 ; and average is:  2
The sum is:  10 ; and average is:  2
The sum is:  15 ; and average is:  3
The sum is:  21 ; and average is:  3
The sum is:  28 ; and average is:  4
The sum is:  36 ; and average is:  4
The sum is:  45 ; and average is:  5
The sum is:  55 ; and average is:  5

```

Alright, this is the end of the day. Will continue from tomorrow.

<script>hljs.highlightAll();</script>
</body>
</html>
