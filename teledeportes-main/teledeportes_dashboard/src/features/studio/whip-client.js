// Minimal WHIP publisher (WebRTC-HTTP Ingestion Protocol) for OvenMediaEngine.
// POSTs an SDP offer to the channel's WHIP URL and starts sending the stream.

function waitIceGathering(pc, timeout = 2500) {
    if (pc.iceGatheringState === 'complete') return Promise.resolve();
    return new Promise((resolve) => {
        const done = () => { clearTimeout(timer); resolve(); };
        const timer = setTimeout(done, timeout);
        pc.addEventListener('icegatheringstatechange', () => {
            if (pc.iceGatheringState === 'complete') done();
        });
    });
}

function resolveLocation(base, location) {
    if (!location) return null;
    try { return new URL(location, base).href; } catch { return location; }
}

export async function publishWhip(url, stream, { iceServers = [] } = {}) {
    const pc = new RTCPeerConnection({ iceServers });

    // Send-only: the browser publishes, it doesn't receive.
    stream.getTracks().forEach(track => pc.addTransceiver(track, { direction: 'sendonly', streams: [stream] }));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitIceGathering(pc);

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: pc.localDescription.sdp,
    });
    if (!res.ok) {
        pc.close();
        throw new Error(`WHIP ${res.status}: no se pudo iniciar la emisión`);
    }

    const answer = await res.text();
    const resourceUrl = resolveLocation(url, res.headers.get('Location'));
    await pc.setRemoteDescription({ type: 'answer', sdp: answer });

    return {
        pc,
        resourceUrl,
        async stop() {
            try { if (resourceUrl) await fetch(resourceUrl, { method: 'DELETE' }); } catch { /* ignore */ }
            pc.getSenders().forEach(s => s.track && s.track.stop());
            pc.close();
        },
    };
}
