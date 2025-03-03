type params = Promise<{room_id: string}>;
type searchParams = Promise<{side: string, ban: string}>;

interface BanpickProps {
    params: params;
    searchParams: searchParams;
}

interface WaitingProps {
    params: params;
}